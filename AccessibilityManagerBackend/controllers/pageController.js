const Page = require('../models/page');
const asyncHandler = require('express-async-handler');


//Apresenta a lista de websites que já temos
exports.pages_list = asyncHandler(async (req, res, next) => {

    console.log("pages_list");

    const pages = await Page.find({}).exec();
    res.send(pages);
});


//Apresenta um website que está na base de dados
exports.page_by_id = asyncHandler(async (req, res, next) => {
    console.log("page_get_by_id");

    const { id } = req.params;

    try {
        const page = await Page.findById(id, { report: 0 }).exec();
        if (page === null) {
            return res.status(404).json({ error: 'Page não encontrado' });
        }
        res.status(200).json(page);
    } catch (error) {
        next(error);
    }
});


//Apagar a página com o id mencionado 
exports.delete_page_by_id = asyncHandler(async (req, res, next) => {

    console.log("delete_page");
    const id = req.params.id;
    console.log(id);

    try {
        if (!id) {

            return res.status(404).json({ error: 'Page não encontrado' });
        }

        const page = await Page.findById(id, { report: 0 }).exec();
        //console.log(page);
        await Page.findByIdAndDelete(page._id).exec();
        console.log('Page apagada com sucesso');
        res.status(200).json({ message: 'Page apagada com sucesso' });

    } catch (error) {
        next(error);
    }
});

