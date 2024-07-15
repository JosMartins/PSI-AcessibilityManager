const express = require('express');
const router = express.Router();
const page_controller = require('../controllers/pageController');
const website_controller = require('../controllers/websiteController');

// Lista todos os pages
router.get('/',page_controller.pages_list);

// Get page pelo id
router.get('/:id',page_controller.page_by_id);

//Apagar a página com o id mencionado 
router.delete('/:id', page_controller.delete_page_by_id);

module.exports = router;