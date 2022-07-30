const http = require('http');
const { leerDB } = require('./src/helpers/gestorArchivo');
const Stocks = require('./src/models/stocks');

const PORT = process.env.PORT || 3000;

const configHeaders = (res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'DELETE, PUT, POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
}

const server = http.createServer((req, res) => {
    const savedStocks = leerDB();
    const stocks = new Stocks();
    const { url, method } = req;
    console.log({ url, method });
    configHeaders(res);
    stocks.cargarStocks(res, savedStocks);

    if (url === '/stocks' && method === 'GET') {
        try {

            res.writeHead(200);
            return res.end(JSON.stringify(stocks._listadoStocks));

        } catch (err) {
            console.log(err)
            res.writeHead(401);
            return res.end(JSON.stringify({
                ok: false,
                message: err.message
            }));
        }

    } else if (url.match(/\/create\/\w+/) && (method === 'POST' || (method === 'OPTIONS' && req.rawHeaders.includes('POST')))) {

        const symbolStock = url.split('/')[2];
        stocks.crearStock(res, symbolStock);

    } else if (url.match(/\/update\/\w+/) && (method === 'PUT' || (method === 'OPTIONS' && req.rawHeaders.includes('PUT')))) {

        const symbolStock = url.split('/')[2];
        stocks.actualizarStock(res, symbolStock);

    } else if (url.match(/\/delete\/\w+/) && (method === 'DELETE' || (method === 'OPTIONS' && req.rawHeaders.includes('DELETE')))) {
        const symbolStock = url.split('/')[2];
        console.log("entra");
        stocks.borrarStock(res, symbolStock);
    } else {
        res.writeHead(404);
        return res.end(JSON.stringify({ ok: false, message: "No existe la ruta" }));
    }



})

server.listen(PORT, () => {
    console.log('server started on port ' + PORT);
});