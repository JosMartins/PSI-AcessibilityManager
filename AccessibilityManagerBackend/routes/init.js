const express = require('express');
const router = express.Router();

//GET home page
router.get('/',(req,res) => {
    res.send('Plataforma de monitorização de acessibilidade!');
});

module.exports = router;
