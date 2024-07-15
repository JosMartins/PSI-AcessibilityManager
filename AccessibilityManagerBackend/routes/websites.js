const express = require('express');
const router = express.Router();
const website_controller = require('../controllers/websiteController');

// Lista todos os websites
router.get('/',website_controller.websites_list);

//Website específico by id
router.get('/:id', website_controller.website_get);

//Adiciona uma página a um website
router.put('/:id', website_controller.add_page);


module.exports = router;