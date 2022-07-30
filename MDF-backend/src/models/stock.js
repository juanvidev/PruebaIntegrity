class Stock {

    id = '';
    company = '';
    logo = '';
    price = 0;
    esPositivo = false;

    constructor(symbol, company, logo, price, esPositivo) {
        this.id = symbol;
        this.company = company;
        this.logo = logo;
        this.price = price;
        this.esPositivo = esPositivo;
    }


}

module.exports = Stock;