const { URL } = require('url');

function pageBelongsToDomain(domainUrl, pageUrl) {

    console.log(pageUrl);
    
    if (!domainUrl || !pageUrl) {
        return false;
    }
    const domainObject = new URL(domainUrl);
    const pageObject = new URL(pageUrl);

    console.log(domainObject.hostname);
    console.log(pageObject.hostname);

    return domainObject.hostname === pageObject.hostname;
}

module.exports = pageBelongsToDomain;