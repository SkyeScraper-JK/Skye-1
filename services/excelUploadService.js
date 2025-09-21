import XLSX from 'xlsx';
import fs from 'fs';

export class ExcelUploadService {
  constructor() {
    // Column mapping configurations
    this.COLUMN_MAPPINGS = {
      unit_number: ['UNIT NO.', 'Unit', 'UNIT NO', 'Unit Number'],
      unit_code: ['UNIT CODE', 'Unit Code', 'CODE'],
      floor: ['LEVEL', 'FLOOR', 'Floor', 'Level'],
      category: ['UNIT CATEGORY', 'Type', 'CATEGORY', 'Unit Category'],
      sub_type: ['Unit Sub Type', 'SUB UNIT TYPE', 'Sub Type'],
      area: ['AREA', 'Net(sqft)', 'Area', 'SQFT'],
      balcony: ['Balcony', 'BALCONY'],
      price: ['PRICE', 'Original Price', 'Base Price'],
      view: ['Unit View', 'Views', 'ACTUAL VIEW', 'View'],
      project: ['TOWER', 'PROJECT', 'Project Name']
    };
    
    this.uploadLogs = []; // Mock database
  }

  async processUpload(file, developerId, socketConnection = null) {
    const uploadLog = this.createUploadLog(file, developerId);
    
    try {
      this.emitProgress(socketConnection, 'analyzing', 'Analyzing file structure...', 1, 6);
      
      // Step 1: Analyze file structure
      const fileBuffer = fs.readFileSync(file.path);
      const workbook = XLSX.read(fileBuffer, { 
        cellStyles: true, 
        cellDates: true,
        cellFormulas: true
      });
      
      const fileStructure = this.detectFileStructure(workbook);
      
      this.emitProgress(socketConnection, 'validating', 'Validating data...', 2, 6);
      
      // Step 2: Extract and validate data
      const extractedData = this.extractData(workbook, fileStructure);
      const validationResults = this.validateData(extractedData);
      
      if (validationResults.criticalErrors.length > 0) {
        throw new Error(`Validation failed: ${validationResults.criticalErrors.join(', ')}`);
      }
      
      this.emitProgress(socketConnection, 'preparing', 'Preparing database...', 3, 6);
      
      // Step 3: Process data
      const processedData = this.processData(extractedData, developerId);
      
      this.emitProgress(socketConnection, 'processing', 'Processing units...', 4, 6);
      
      // Step 4: Simulate database operations
      await this.simulateDatabase(processedData, socketConnection);
      
      this.emitProgress(socketConnection, 'pricing', 'Processing pricing options...', 5, 6);
      
      // Step 5: Process pricing
      await this.processPricingOptions(processedData.pricingData);
      
      this.emitProgress(socketConnection, 'finalizing', 'Notifying agents...', 6, 6);
      
      // Step 6: Notify agents
      await this.notifyAgents(processedData.projects, developerId);
      
      // Complete upload log
      this.completeUploadLog(uploadLog.id, processedData.summary);
      
      this.emitComplete(socketConnection, processedData.summary);
      
      // Clean up uploaded file
      fs.unlinkSync(file.path);
      
      return {
        success: true,
        summary: processedData.summary,
        warnings: validationResults.warnings
      };
      
    } catch (error) {
      this.failUploadLog(uploadLog.id, error.message);
      this.emitError(socketConnection, error.message);
      
      // Clean up uploaded file
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      
      throw error;
    }
  }

  detectFileStructure(workbook) {
    const sheets = workbook.SheetNames;
    
    if (sheets.length > 1) {
      const projects = sheets.map(sheetName => this.extractProjectInfo(sheetName));
      return {
        type: 'MULTI_PROJECT',
        projects,
        totalSheets: sheets.length
      };
    }
    
    return {
      type: 'SINGLE_PROJECT',
      projectInfo: this.extractProjectInfo(sheets[0])
    };
  }

  extractProjectInfo(sheetName) {
    const handoverMatch = sheetName.match(/(Q[1-4]\s+\d{4}|[A-Z]{3}\s+\d{4}|\d{4})/i);
    const projectName = sheetName.replace(/\s*-\s*(Q[1-4]\s+\d{4}|[A-Z]{3}\s+\d{4}).*$/i, '').trim();
    
    return {
      name: projectName,
      sheetName,
      handoverDate: handoverMatch ? handoverMatch[0] : null
    };
  }

  extractData(workbook, structure) {
    const allData = [];
    
    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1, 
        defval: '',
        raw: false 
      });
      
      if (jsonData.length < 2) continue;
      
      // Find header row
      let headerRowIndex = 0;
      for (let i = 0; i < Math.min(3, jsonData.length); i++) {
        if (this.isHeaderRow(jsonData[i])) {
          headerRowIndex = i;
          break;
        }
      }
      
      const headers = jsonData[headerRowIndex];
      const dataRows = jsonData.slice(headerRowIndex + 1);
      
      const mappedData = this.mapColumns(headers, dataRows, structure.type === 'MULTI_PROJECT' ? sheetName : null);
      
      allData.push({
        sheetName,
        projectInfo: structure.type === 'MULTI_PROJECT' ? 
          structure.projects.find(p => p.sheetName === sheetName) :
          structure.projectInfo,
        data: mappedData,
        headers
      });
    }
    
    return allData;
  }

  mapColumns(headers, dataRows, projectName = null) {
    const columnMapping = this.createColumnMapping(headers);
    
    return dataRows.map((row, index) => {
      const mappedRow = {
        _rowIndex: index + 2,
        _projectName: projectName
      };
      
      Object.entries(columnMapping).forEach(([field, colIndex]) => {
        if (colIndex !== -1 && row[colIndex] !== undefined) {
          mappedRow[field] = this.cleanValue(row[colIndex], field);
        }
      });
      
      return mappedRow;
    }).filter(row => row.unit_number);
  }

  createColumnMapping(headers) {
    const mapping = {};
    
    Object.entries(this.COLUMN_MAPPINGS).forEach(([field, alternatives]) => {
      const matchedIndex = headers.findIndex(header => 
        alternatives.some(alt => 
          header && header.toString().toLowerCase().trim() === alt.toLowerCase().trim()
        )
      );
      mapping[field] = matchedIndex;
    });
    
    return mapping;
  }

  validateData(extractedData) {
    const errors = [];
    const warnings = [];
    const criticalErrors = [];
    
    for (const sheetData of extractedData) {
      for (const unit of sheetData.data) {
        if (!unit.unit_number) {
          criticalErrors.push(`Row ${unit._rowIndex}: Unit number is required`);
        }
        
        if (!unit.area || unit.area <= 0) {
          criticalErrors.push(`Row ${unit._rowIndex}: Valid area is required`);
        }
        
        if (!unit.price || unit.price <= 0) {
          criticalErrors.push(`Row ${unit._rowIndex}: Valid price is required`);
        }
        
        if (unit.area && unit.price) {
          const pricePerSqft = unit.price / unit.area;
          if (pricePerSqft < 100 || pricePerSqft > 50000) {
            warnings.push(`Row ${unit._rowIndex}: Price per sq ft (${pricePerSqft.toFixed(2)}) seems unusual`);
          }
        }
      }
    }
    
    return { errors, warnings, criticalErrors };
  }

  processData(extractedData, developerId) {
    const projects = [];
    const pricingData = [];
    let totalUnits = 0;
    
    for (const sheetData of extractedData) {
      const projectData = {
        name: sheetData.projectInfo.name,
        location: 'Business Bay, Dubai',
        handoverDate: sheetData.projectInfo.handoverDate,
        units: sheetData.data.map(unit => ({
          unit_number: unit.unit_number,
          unit_code: unit.unit_code || `${sheetData.projectInfo.name}-${unit.unit_number}`,
          floor: unit.floor,
          category: unit.category,
          sub_type: unit.sub_type,
          area: unit.area,
          balcony_area: unit.balcony,
          view_description: unit.view,
          base_price: unit.price,
          current_price: unit.price
        }))
      };
      
      totalUnits += projectData.units.length;
      projects.push(projectData);
    }
    
    return {
      developerId,
      projects,
      pricingData,
      summary: {
        projectsProcessed: projects.length,
        unitsProcessed: totalUnits,
        timestamp: new Date().toISOString()
      }
    };
  }

  async simulateDatabase(processedData, socketConnection) {
    let processedUnits = 0;
    const totalUnits = processedData.summary.unitsProcessed;
    
    for (const project of processedData.projects) {
      for (const unit of project.units) {
        // Simulate database write delay
        await new Promise(resolve => setTimeout(resolve, 50));
        
        processedUnits++;
        
        if (processedUnits % 5 === 0 && socketConnection) {
          socketConnection.emit('unit_progress', {
            processed: processedUnits,
            total: totalUnits,
            currentProject: project.name
          });
        }
      }
    }
  }

  async processPricingOptions(pricingData) {
    // Simulate pricing processing
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async notifyAgents(projects, developerId) {
    // Simulate agent notification
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  cleanValue(value, field) {
    if (value === null || value === undefined || value === '') return null;
    
    const str = value.toString().trim();
    
    switch (field) {
      case 'area':
      case 'price':
      case 'balcony':
        return this.parseNumber(str);
      case 'floor':
        return parseInt(str) || null;
      default:
        return str;
    }
  }

  parseNumber(value) {
    if (typeof value === 'number') return value;
    const str = value.toString().replace(/[,$\s]/g, '');
    const num = parseFloat(str);
    return isNaN(num) ? null : num;
  }

  isHeaderRow(row) {
    if (!Array.isArray(row) || row.length < 3) return false;
    
    const nonEmptyValues = row.filter(cell => 
      cell !== null && cell !== undefined && cell.toString().trim() !== ''
    );
    
    return nonEmptyValues.length >= 3 && 
           nonEmptyValues.some(cell => 
             this.COLUMN_MAPPINGS.unit_number.some(alt => 
               cell.toString().toLowerCase().includes(alt.toLowerCase())
             )
           );
  }

  createUploadLog(file, developerId) {
    const log = {
      id: this.uploadLogs.length + 1,
      developer_id: developerId,
      filename: file.originalname,
      file_size: file.size,
      status: 'PROCESSING',
      created_at: new Date().toISOString()
    };
    
    this.uploadLogs.push(log);
    return log;
  }

  completeUploadLog(logId, summary) {
    const log = this.uploadLogs.find(l => l.id === logId);
    if (log) {
      log.status = 'COMPLETED';
      log.projects_processed = summary.projectsProcessed;
      log.units_processed = summary.unitsProcessed;
      log.summary = summary;
    }
  }

  failUploadLog(logId, errorMessage) {
    const log = this.uploadLogs.find(l => l.id === logId);
    if (log) {
      log.status = 'FAILED';
      log.error_details = { error: errorMessage };
    }
  }

  async getUploadHistory(developerId) {
    return this.uploadLogs.filter(log => log.developer_id === developerId);
  }

  // Socket helper methods
  emitProgress(socket, status, message, step, total) {
    if (socket) {
      socket.emit('upload_progress', { status, message, step, total });
    }
  }

  emitComplete(socket, summary) {
    if (socket) {
      socket.emit('upload_complete', { success: true, summary });
    }
  }

  emitError(socket, error) {
    if (socket) {
      socket.emit('upload_error', { error });
    }
  }
}