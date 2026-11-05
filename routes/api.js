const express = require('express');
const router = express.Router();

const masterController = require('../controllers/masterController');
const mprController = require('../controllers/mprController');

// PRISM Projects Master Routes
router.get('/masters/prism-projects', masterController.getPrismProjects);
router.post('/masters/prism-projects', masterController.createPrismProject);
router.put('/masters/prism-projects/:id', masterController.updatePrismProject);
router.delete('/masters/prism-projects/:id', masterController.deletePrismProject);

// Emerging Tech Master Routes
router.get('/masters/emerging-tech', masterController.getEmergingTechTypes);
router.post('/masters/emerging-tech', masterController.createEmergingTechType);
router.put('/masters/emerging-tech/:id', masterController.updateEmergingTechType);
router.delete('/masters/emerging-tech/:id', masterController.deleteEmergingTechType);

// National Products Master Routes
router.get('/masters/national-products', masterController.getNationalProducts);
router.post('/masters/national-products', masterController.createNationalProduct);
router.put('/masters/national-products/:id', masterController.updateNationalProduct);
router.delete('/masters/national-products/:id', masterController.deleteNationalProduct);

// MPR CRUD Routes
router.get('/mpr', mprController.getAllReports);
router.get('/mpr/:id', mprController.getReportById);
router.post('/mpr', mprController.createReport);
router.put('/mpr/:id', mprController.updateReport);
router.delete('/mpr/:id', mprController.deleteReport);

module.exports = router;
