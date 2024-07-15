const Website = require('../models/website');
const asyncHandler = require('express-async-handler');
const Page = require('../models/page');
const pageBelongsToDomain = require('../helpers/urlFunctions');
const { json } = require('express');
const website = require('../models/website');
const evaluatePage = require('../helpers/evaluatorFunctions');
const evaluateFuncs = require('../helpers/evaluateTest');


//Apresenta a lista de websites que já temos
exports.websites_list = asyncHandler(async (req, res, next) => {

    console.log("websites_list");

    const websites = await Website.find({}).select('-reports').exec();
    res.send(websites);
});


//Adiciona um website à base de dados
exports.website_post = asyncHandler(async (req, res, next) => {
    console.log("website_post");

    const { url } = req.body;

    if (url === null) {
        return res.status(400).json({ error: 'URL não fornecido' });
    }

    try {
        const website = new Website({ url });
        const existing = await Website.findOne({ url });
        if (existing) {
            return res.status(400).json({ error: 'Website já existe' });
        }
        await website.save();
        res.status(201).json(website);
    } catch (error) {
        next(error);
    }
});


//Apresenta um website que está na base de dados
exports.website_get = asyncHandler(async (req, res, next) => {
    console.log("website_get");

    const { id } = req.params;
    console.log(id);

    try {
        const website = await Website.findById(id).exec();
        if (website === null) {
            error(404);
        }
        res.status(200).json(website);
    } catch (error) {
        return res.status(404).json({ error: 'Website não encontrado' });
    }
});


//Adicionar página ao website
exports.add_page = asyncHandler(async (req, res, next) => {

    console.log("add_page");

    const websiteId = req.params.id;
    const pageUrl = req.body.url;

    try {
        if (websiteId === null || pageUrl === null) {
            return res.status(404).json({ error: "Id do website ou URL da página não fornecido" });
        }

        const website = await Website.findById(websiteId).exec();

        if (website === null) {
            return res.status(404).json({ message: "Website não encontrado" });
        }

        // Verifica se o URL da página pertence ao domínio do website
        if (!pageBelongsToDomain(website.url, pageUrl)) {
            return res.status(400).json({ error: 'URL da página não pertence ao domínio do website' });
        }

        const page = new Page({ url: pageUrl });
        const existing = await Page.findOne({ url: pageUrl });
        if (existing) {
            return res.status(400).json({ error: 'Page já existe' });
        }
        let output = await page.save();
        console.log(output);

        // Adiciona a página ao website
        website.pages.push(output);

        website.status = 'Por Avaliar';
        await website.save();


        res.status(201).json({ message: 'Página adicionada com sucesso ao website', website });
    } catch (error) {
        next(error);
    }
});


// Obtém as páginas de um website específico
exports.get_pages = asyncHandler(async (req, res, next) => {

    console.log("get_pages");
    const id = req.params.id;

    try {
        const website = await Website.findById(id).exec();
        if (!website) {
            return res.status(404).json({ error: 'Website não encontrado' });
        }

        // Buscar as páginas associadas ao website
        const pageIds = website.pages;

        // Array para armazenar informações das páginas
        const pages = [];

        // Iterar sobre os IDs das páginas e buscar suas informações
        for (const pageId of pageIds) {
            const page = await Page.findById(pageId).exec();

            if (!page) {
                console.log(`Página com ID ${pageId} não encontrada.`);
                continue;
            }

            pages.push(page);
        }

        // Retornar as informações das páginas encontradas
        res.status(200).json(pages);

    } catch (error) {
        return res.status(404).json({ error: 'Website não encontrado' });
    }
});


exports.delete_website = asyncHandler(async (req, res, next) => {

    console.log("delete_website");
    const id = req.params.id;

    try {
        if (!id) {
            return res.status(404).json({ error: 'Website não encontrado' });
        }

        const website = await Website.findById(id).exec();
        //console.log(website.pages);
        //console.log(website.pages.length > 0);

        if (website.pages.length > 0) {

            while (website.pages.length > 0) {
                const page = website.pages.pop();

                //console.log(page);
                console.log('Id da page');
                console.log(page._id);

                await Page.findByIdAndDelete(page._id).exec();

            }
            console.log('Pages apagadas');
        }

        await Website.findByIdAndDelete(id).exec();
        console.log('Website apagado com sucesso');
        res.status(200).json({ message: 'Website apagado com sucesso' });

    } catch (error) {
        next(error);
    }
});


//Apaga uma determinada página de um website pelo id 
exports.delete_website_page_by_id = asyncHandler(async (req, res, next) => {
    console.log("delete_website_page_by_id");
    const websiteId = req.params.websiteId;
    const pageId = req.params.pageId;

    try {
        if (!websiteId) {
            return res.status(404).json({ error: 'Website não encontrado' });
        }

        if (!pageId) {
            return res.status(404).json({ error: 'Page não encontrada' });
        }
        console.log('website encontrado e page encontrada');
        console.log('Website id:', websiteId);
        console.log('Page id:', pageId);

        const website = await Website.findById(websiteId);
        //console.log('Website', website);

        const page = await Page.findById(pageId);
        if (!page) {
            return res.status(404).json({ error: 'Página não encontrada' });
        }

        //console.log('Pages do website no inicio', website.pages);

        website.pages = website.pages.filter(page => !page._id.equals(pageId));
        //console.log("reports ->", website.reports);


        const index = website.orderOfReports.indexOf(page.url);
        console.log(index);

        if (index !== -1) {
            website.orderOfReports.splice(index, 1);
            website.reports.splice(index, 1);
            website.topErrors = evaluateFuncs.getTopFailedAssertions(website.reports);
            console.log(`Relatório removido do índice ${index}`);
        }
        //console.log("reports ->", website.reports);

        await Page.findByIdAndDelete(pageId);

        console.log('Pages do website no fim', website.pages);

        const number_of_pages_evaluated = await allPagesEvaluated(website);

        if (number_of_pages_evaluated == website.pages.length) {
            website.status = 'Avaliado';
        } else {
            website.status = 'Por Avaliar';
        }

        console.log("Length de pages ->", website.pages.length === 0);
        if (website.pages.length === 0) {
            website.status = 'Por Avaliar';
        }
        await website.save();

        return res.status(200).json({ message: 'Page apagada com sucesso!' });

    } catch (error) {
        next(error);
    }
});

exports.evaluate_page = asyncHandler(async (req, res, next) => {
    console.log("evaluate_page");

    const websiteId = req.params.websiteId;
    const pageId = req.params.pageId;

    console.log("websiteId:", websiteId);
    console.log("pageId:", pageId);

    const website = await Website.findById(websiteId);

    if (!website) {
        return res.status(404).json({ error: 'Website não encontrado' });
    }

    const page = await Page.findById(pageId);

    if (!page) {
        return res.status(404).json({ error: 'Page não encontrada' });
    }

    if (!(website.pages.some(pageId => pageId.equals(page._id)))) {
        return res.status(404).json({ error: 'Page não pertence às pages do website' });
    }

    try {

        const result = await evaluatePage(page);
        console.log('Resultado', result);

        if (website.orderOfReports.indexOf(page.url) === -1) {
            website.orderOfReports.push(page.url);
            website.reports.push(result);
            await website.save();
        }



        if (result !== undefined) {
            const fails = evaluateFuncs.getFailedAssertionsByLevel(result);
            console.log("f", fails);
            if (fails['A'] === 0 && fails['AA'] === 0 && fails['AAA'] === 0) {
                page.aErrors = 0;
                page.aaErrors = 0;
                page.aaaErrors = 0;
                page.status = 'Conforme';
            } else {
                page.aErrors = fails['A'];
                page.aaErrors = fails['AA'];
                page.aaaErrors = fails['AAA'];
                page.status = 'Não Conforme';
            }

            website.topErrors = evaluateFuncs.getTopFailedAssertions(website.reports);
        }
        page.lastReportDate = Date.now();
        await page.save();
        console.log('Page no estado final', page);


        const number_of_pages_evaluated = await allPagesEvaluated(website);
        if (number_of_pages_evaluated === website.pages.length) {
            website.status = 'Avaliado';
        }

        website.lastReportDate = Date.now();
        await website.save();

        console.log('Website.status', website.status);


        return res.status(200).json('Page avaliado com sucesso');

    } catch (error) {
        website.status = 'Erro na Avaliação';
        website.lastReportDate = Date.now();
        page.lastReportDate = Date.now();
        console.log(error);
        await page.save();
        await website.save();
        return res.status(500).json({ error: 'Erro durante a avaliação da página' });
    }
});


exports.get_top10_errors = asyncHandler(async (req, res) => {
    console.log("get_top10_errors");

    const websiteId = req.params.websiteId;
    console.log(websiteId);

    try {
        const website = await Website.findById(websiteId);

        if (!website) {
            return res.status(404).json({ error: 'Website não encontrado' });
        }

        console.log(website.reports);

        const top10 = evaluateFuncs.getTopFailedAssertions(website.reports);
        console.log(top10);
        website.topErrors = top10;
        website.save();
        console.log(website.topErrors);
        res.status(200).json(top10);
    } catch (err) {
        console.error('Erro ao obter os 10 principais erros:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

exports.get_page_report = asyncHandler(async (req, res) => {
    console.log("get_page_reports");

    const websiteId = req.params.websiteId;
    const pageId = req.params.pageId;
    console.log(websiteId);

    try {
        const website = await Website.findById(websiteId);
        const page = await Page.findById(pageId);
        report = website.reports.find(report => Object.keys(report)[0] === page.url);
        console.log(report);

        res.status(200).json(report);
    } catch (error) {

        if (error.status === 404) {
            return res.status(404).json({ error: 'Website ou Page não encontrado' });
        } else {
            console.error('Erro ao obter o relatório da página:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }

    }

});

async function allPagesEvaluated(website) {
    let number_of_pages_evaluated = 0;
    for (const pageId of website.pages) {
        const page = await Page.findById(pageId);
        if (page && page.status !== "Por Avaliar") {
            number_of_pages_evaluated++;
        }
    }
    console.log(number_of_pages_evaluated);
    return (number_of_pages_evaluated);
}
