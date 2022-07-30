const TOKEN_API = 'pk_3565f643c8b449e792b6e3a46d3614a3';
const BASE_URL = 'https://cloud.iexapis.com/stable/stock'

const requestStock = (symbol) =>
    `${BASE_URL}/${symbol}/quote?token=${TOKEN_API}`;
const requestLogoStock = (symbol) =>
    `${BASE_URL}/${symbol}/logo?token=${TOKEN_API}`;

module.exports = {
    requestStock,
    requestLogoStock
}