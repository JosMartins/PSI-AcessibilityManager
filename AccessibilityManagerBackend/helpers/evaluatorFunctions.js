const { QualWeb } = require('@qualweb/core');


async function evaluatePage(page) {

    // plugins para bloquear anúncios e para que não seja detectado que o browser que está a ser usado em modo automático
    const plugins = {
        adBlock: false, // Default value = false
        stealth: true // Default value = false
    };

    // o avaliador cria um cluster de páginas em avaliação
    // definir o tempo que cada tab do browser vai esperar pelo fim do carregamento da página
    const clusterOptions = {
        timeout: 60 * 1000, // Timeout for loading page. Default value = 30 seconds
    };
    // opções para lançamento do browser
    const launchOptions = {
        args: ['--no-sandbox', '--ignore-certificate-errors']
    };

    // criar instância do avaliador
    const qualweb = new QualWeb(plugins);

    // iniciar o avalidor
    await qualweb.start(clusterOptions, launchOptions);

    // especificar as opções, incluindo o url a avaliar
    const qualwebOptions = {
        url: page.url
    };
    // executar a avaliação, recebendo o relatório
    const report = await qualweb.evaluate(qualwebOptions);
    // parar o avaliador
    await qualweb.stop();

    return report;
};

module.exports = evaluatePage;