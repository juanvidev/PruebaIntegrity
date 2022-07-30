
const BASE_URL = 'http://localhost:3000';
const btnAgregar = document.getElementById('createStock');

const getDataStocks = async () => {
    const urlGetStocks = `${BASE_URL}/stocks`
    try {
        const stocks = await fetch(urlGetStocks)
            .then((res) => res.json())
            .catch((err) => console.log({ err }));


        createStock(Object.values(stocks));
    } catch (error) {
        console.log({ error })
    }

}

const createStock = (stocks) => {
    const divStocksParent = document.querySelector("#divStocks");
    if (stocks.length === 0) {
        let h2 = document.createElement("h2");
        h2.textContent = 'No hay ningun stock en monitoreo. =(';

        return divStocksParent.append(h2);
    }

    stocks.forEach((stock) => {
        const divStock = document.createElement("div");
        const divContainerLogo = document.createElement("div");
        const divSeparator = document.createElement("separator");
        const divSeparator2 = document.createElement("separator");
        const divSeparator3 = document.createElement("separator");
        const divContainerCompany = document.createElement("div");
        const divContainerPrice = document.createElement("div");
        const divContainerButtons = document.createElement("div");
        const h3TitleCompany = document.createElement("h3");
        const imgLogo = document.createElement("img");
        const h3TitlePrice = document.createElement("h3");
        const iconArrow = document.createElement("img");
        const btnDelete = document.createElement("button");
        const btnUpdate = document.createElement("button");
        const iconDelete = document.createElement("img");
        const iconUpdate = document.createElement("img");

        imgLogo.classList.add('logo-img');
        imgLogo.setAttribute("src", stock.logo);

        h3TitleCompany.classList.add('title-company');
        h3TitleCompany.textContent = stock.company.split(' ')[0].toUpperCase();


        if (stock.esPositivo) {
            h3TitlePrice.classList.add('title-price', 'es-positivo');
            iconArrow.classList.add('icon-arrow', 'es-positivo');
            iconArrow.setAttribute("src", "assets/img/arrow-up.png");
        } else {
            h3TitlePrice.classList.add('title-price', 'es-negativo');
            iconArrow.classList.add('icon-arrow', 'es-negativo');
            iconArrow.setAttribute("src", "assets/img/arrow-down.png");
        }

        h3TitlePrice.textContent = stock.price;

        btnDelete.classList.add('btn-delete');
        btnDelete.append(iconDelete);
        iconDelete.classList.add('icon-delete');
        iconDelete.setAttribute("src", "assets/img/delete.png")

        btnUpdate.classList.add('btn-update');
        btnUpdate.append(iconUpdate);
        iconUpdate.classList.add('icon-update');
        iconUpdate.setAttribute("src", "assets/img/refresh.png")

        divContainerButtons.classList.add('container-buttons');
        divContainerPrice.classList.add('container-price');
        divContainerCompany.classList.add('container-companyName');
        divSeparator.classList.add("separator");
        divSeparator2.classList.add("separator");
        divSeparator3.classList.add("separator");
        divContainerLogo.classList.add("container-logoStock");
        divStock.classList.add('stock');


        divContainerButtons.append(btnDelete, btnUpdate);
        divContainerPrice.append(h3TitlePrice, iconArrow);
        divContainerCompany.append(h3TitleCompany);
        divContainerLogo.append(imgLogo)
        divStock.append(
            divContainerLogo,
            divSeparator3,
            divContainerCompany,
            divSeparator2,
            divContainerPrice,
            divSeparator,
            divContainerButtons);
        divStocksParent.append(divStock);


        handleUpdateStock(btnUpdate, stock.id);
        handleDeleteStock(btnDelete, stock.id);
    });
}

btnAgregar.addEventListener("click", (e) => {
    e.preventDefault();
    btnAgregar.disabled = true;
    btnAgregar.style.cursor = 'default';
    btnAgregar.style.removeProperty('background-color');
    sendCreateStock();
})


const sendCreateStock = async () => {
    let inputValue = document.getElementById('fieldStock');
    inputValue.disabled = true;
    const labelConfirm = document.getElementById('labelConfirm');
    const urlCreateStock = `${BASE_URL}/create/${inputValue.value}`;

    if (inputValue.value !== '') {

        const response = await fetch(urlCreateStock, { method: 'POST' })
            .then((res) => res.json())
            .catch((err) => handleError(err));

        if (response.ok !== undefined) return handleError(response);


    }
    inputValue.value = '';
    labelConfirm.removeAttribute('hidden');
    setTimeout(() => {
        location.reload();
    }, 2500);
}

const handleUpdateStock = (btnUpdate, symbol) => {
    const urlUpdateStock = `${BASE_URL}/update/${symbol}`;
    const labelUpdateConfirm = document.getElementById('labelUpdateConfirm');

    btnUpdate.addEventListener('click', async (e) => {
        e.preventDefault();

        const response = await fetch(urlUpdateStock, { method: 'PUT' })
            .then((res) => res.json())
            .catch((err) => handleError(err));

        if (response.ok !== undefined) return handleError(response);

        labelUpdateConfirm.removeAttribute('hidden');
        setTimeout(() => {
            location.reload();
        }, 1500);
    })


}

const handleDeleteStock = (btnDelete, symbol) => {
    const urlDeleteStock = `${BASE_URL}/delete/${symbol}`;
    const labelDeleteConfirm = document.getElementById('labelDeleteConfirm');

    btnDelete.addEventListener('click', async (e) => {
        e.preventDefault();
        await fetch(urlDeleteStock, { method: 'DELETE' })
            .then((res) => res.json())
            .catch((err) => handleError(err));

        labelDeleteConfirm.removeAttribute('hidden');
        setTimeout(() => {
            location.reload();
        }, 1500);
    })
}

const handleError = (res) => {
    const labelError = document.getElementById('labelError');
    labelError.removeAttribute('hidden');
    labelError.textContent = 'Error con la peticion';
    setTimeout(() => {
        location.reload();
    }, 1500);
}

getDataStocks();