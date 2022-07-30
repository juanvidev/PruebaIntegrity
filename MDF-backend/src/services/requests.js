const https = require('https');

const getStockDataAPI = (url) => new Promise((resolve, reject) => {
    try {

        https.get(url, (resp) => {
            let data = '';

            resp.on('data', (chunk) => {
                data += chunk;
            })

            resp.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    reject(error);
                }
            })
        })
    } catch (error) {
        reject(error);
    }

});

const getStockLogoApi = (url) => new Promise((resolve, reject) => {
    try {

        https.get(url, (resp) => {
            let data = '';

            resp.on('data', (chunk) => {
                data += chunk;
            })

            resp.on('end', () => {
                try {
                    resolve(JSON.parse(data).url);
                } catch (error) {
                    console.log({ error })
                    reject(error);
                }
            })
        })
    } catch (error) {
        console.log({ error })
        reject(error);
    }

})

const getAllDataStock = async (urlRequestStock, urlRequestLogoStock) => {
    const logoStock = await getStockLogoApi(urlRequestLogoStock);
    const { symbol, companyName, latestPrice, change } = await getStockDataAPI(urlRequestStock);
    return {
        symbol,
        companyName,
        logoStock,
        latestPrice,
        change,
    }
}

module.exports = {
    getAllDataStock,
    getStockDataAPI,
    getStockLogoApi
}