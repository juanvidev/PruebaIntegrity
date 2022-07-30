const fs = require('fs');

const rutaArchivo = './src/db/stocks.json';

const guardarDB = (data) => {

    fs.writeFileSync(rutaArchivo, JSON.stringify(data));

}

const leerDB = () => {

    if (!fs.existsSync(rutaArchivo)) null;
    const stocks = fs.readFileSync(rutaArchivo, { encoding: 'utf-8' });

    return JSON.parse(stocks);

}

module.exports = {
    guardarDB,
    leerDB
}