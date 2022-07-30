const { guardarDB } = require('../helpers/gestorArchivo');
const { requestLogoStock, requestStock } = require('../services/endpoints');
const { getAllDataStock, getStockDataAPI } = require('../services/requests');
const Stock = require('./stock');

class Stocks {

    _listadoStocks = {};

    constructor() {
        this._listadoStocks = {}
    };

    get listadoArr() {
        return Object.values(this._listadoStocks);
    }

    cargarStocks(res, stocks = []) {
        stocks.forEach((stock) => {
            this._listadoStocks[stock.id] = stock;
        })

    }

    async crearStock(res, symbolStock) {
        const urlRequestStock = requestStock(symbolStock);
        const urlRequestLogoStock = requestLogoStock(symbolStock);
        try {

            if (this._listadoStocks[symbolStock.toUpperCase()]) {
                res.writeHead(409);
                return res.end(JSON.stringify({ ok: false, error: 'Ya existe un stock con ese simbolo!' }));
            }

            const {
                symbol,
                companyName,
                logoStock,
                latestPrice,
                change
            } = await getAllDataStock(urlRequestStock, urlRequestLogoStock);

            const stock = new Stock(symbol, companyName, logoStock, latestPrice, change > 0 ? true : false);
            this._listadoStocks[stock.id] = stock;

            guardarDB(this.listadoArr);

            res.writeHead(201);
            return res.end(JSON.stringify({ message: 'Stock creado!', stock }));

        } catch (err) {
            res.writeHead(500);
            return res.end(JSON.stringify({ ok: false, error: err.message }));
        }




    }

    async actualizarStock(res, symbolStock) {
        const urlUpdateStock = requestStock(symbolStock);

        try {
            if (!this._listadoStocks[symbolStock.toUpperCase()]) {
                res.writeHead(404);
                return res.end(JSON.stringify({ ok: false, error: 'No existe un stock con ese simbolo' }));
            }
            const { latestPrice, change } = await getStockDataAPI(urlUpdateStock);

            this._listadoStocks[symbolStock.toUpperCase()].price = latestPrice;
            this._listadoStocks[symbolStock.toUpperCase()].esPositivo = change > 0 ? true : false;

            const stockToUpdate = this._listadoStocks[symbolStock.toUpperCase()];

            guardarDB(this.listadoArr);

            res.writeHead(200);
            return res.end(JSON.stringify({ message: 'Stock actualizado!', stockToUpdate }));
        } catch (error) {
            console.log(error)
            res.writeHead(500);
            return res.end(JSON.stringify({ ok: false, error: error.message }));
        }

    }

    borrarStock(res, symbolStock) {
        try {

            if (!this._listadoStocks[symbolStock.toUpperCase()]) {
                res.writeHead(404);
                return res.end(JSON.stringify({ ok: false, error: 'No existe el stock con ese simbolo' }));
            }

            delete this._listadoStocks[symbolStock.toUpperCase()];
            guardarDB(this.listadoArr);
            res.writeHead(200);
            return res.end(JSON.stringify({ ok: true, message: 'Stock eliminado!' }));
        } catch (error) {
            console.log(error)
            res.writeHead(500);
            return res.end(JSON.stringify({ ok: false, error: error.message }));
        }

    }
}

module.exports = Stocks;