import express from 'express';

const router = express.Router();

// Mock projects and units data
const projects = [];
const units = [];

// Get all available inventory
router.get('/inventory', (req, res) => {
  const { project, location, price_min, price_max } = req.query;
  
  let availableUnits = units.filter(u => u.status === 'AVAILABLE');
  
  // Apply filters
  if (project) {
    const filteredProjects = projects.filter(p => 
      p.name.toLowerCase().includes(project.toLowerCase())
    );
    availableUnits = availableUnits.filter(u => 
      filteredProjects.some(p => p.id === u.project_id)
    );
  }
  
  if (price_min) {
    availableUnits = availableUnits.filter(u => u.current_price >= parseFloat(price_min));
  }
  
  if (price_max) {
    availableUnits = availableUnits.filter(u => u.current_price <= parseFloat(price_max));
  }

  // Add project information
  const inventory = availableUnits.map(unit => {
    const project = projects.find(p => p.id === unit.project_id);
    return {
      ...unit,
      project_name: project ? project.name : 'Unknown Project',
      project_location: project ? project.location : null,
      handover_date: project ? project.handover_date : null
    };
  });

  res.json({
    success: true,
    inventory,
    total: inventory.length
  });
});

// Get agent dashboard stats
router.get('/dashboard/stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      total_projects: projects.length,
      available_units: units.filter(u => u.status === 'AVAILABLE').length,
      my_leads: 0,
      active_bookings: 0,
      notifications: 0
    }
  });
});

// Get notifications
router.get('/notifications', (req, res) => {
  // Mock notifications
  const notifications = [
    {
      id: 1,
      type: 'INVENTORY_UPDATE',
      title: 'New inventory from Azure Developers',
      message: 'Sky Tower Bay Square: 120 units updated with latest pricing',
      is_read: false,
      created_at: new Date().toISOString(),
      data: {
        project_name: 'Sky Tower Bay Square',
        unit_count: 120
      }
    }
  ];

  res.json({
    success: true,
    notifications
  });
});

export default router;