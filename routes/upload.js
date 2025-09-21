import express from 'express';
import { ExcelUploadService } from '../services/excelUploadService.js';

const router = express.Router();

const uploadService = new ExcelUploadService();

// Upload Excel file endpoint
router.post('/excel', async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const userId = req.user.id;
    const io = req.app.get('io');
    const socketConnection = req.body.socketId ? io.sockets.sockets.get(req.body.socketId) : null;
    
    const result = await uploadService.processUpload(
      req.file, 
      userId, 
      socketConnection
    );
    
    res.json(result);
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get upload history
router.get('/history', async (req, res) => {
  try {
    const history = await uploadService.getUploadHistory(req.user.id);
    
    res.json({
      success: true,
      uploads: history
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;