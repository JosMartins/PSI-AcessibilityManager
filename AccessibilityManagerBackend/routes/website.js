const express = require('express');
const router = express.Router();
const website_controller = require('../controllers/websiteController');

//Cria um website
router.post('/', website_controller.website_post);

//Lista as páginas de um website
router.get('/:id', website_controller.get_pages);

//Apaga um website (apaga também as respetivas páginas)
router.delete('/:id', website_controller.delete_website);

//Apaga uma determinada página de um website pelo id 
router.delete('/:websiteId/:pageId', website_controller.delete_website_page_by_id);

//Avalia uma página pelo seu id
router.put('/evaluate/:websiteId/:pageId', website_controller.evaluate_page);

//Busca a lista com os 10 erros de acessibilidade mais comuns no total de todas as pages de um website avaliadas
router.get('/top10/:websiteId', website_controller.get_top10_errors);

//Busca o relatório de acessibilidade de uma página
router.get('/:websiteId/:pageId/report', website_controller.get_page_report);
module.exports = router;