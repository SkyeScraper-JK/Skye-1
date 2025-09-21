import express from 'express';

const router = express.Router();

// Mock projects database
const projects = [];
const units = [];

// Get all projects for developer
router.get('/projects', (req, res) => {
  const developerProjects = projects.filter(p => p.developer_id === req.user.id);
  
  res.json({
    success: true,
    projects: developerProjects.map(project => ({
      ...project,
      unit_count: units.filter(u => u.project_id === project.id).length
    }))
  });
});

// Get project details with units
router.get('/projects/:id', (req, res) => {
  const projectId = parseInt(req.params.id);
  const project = projects.find(p => p.id === projectId && p.developer_id === req.user.id);
  
  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  const projectUnits = units.filter(u => u.project_id === projectId);
  
  res.json({
    success: true,
    project: {
      ...project,
      units: projectUnits
    }
  });
});

// Get dashboard statistics
router.get('/dashboard/stats', (req, res) => {
  const developerProjects = projects.filter(p => p.developer_id === req.user.id);
  const totalUnits = developerProjects.reduce((total, project) => {
    return total + units.filter(u => u.project_id === project.id).length;
  }, 0);

  const availableUnits = developerProjects.reduce((total, project) => {
    return total + units.filter(u => u.project_id === project.id && u.status === 'AVAILABLE').length;
  }, 0);

  res.json({
    success: true,
    stats: {
      total_projects: developerProjects.length,
      total_units: totalUnits,
      available_units: availableUnits,
      sold_units: totalUnits - availableUnits,
      recent_uploads: 0
    }
  });
});

export default router;