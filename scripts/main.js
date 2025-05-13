import * as api from './api.js';

const menu_option = document.getElementById("menu-option");
const icon_option = document.querySelector('.button-menu-display img');
const form = document.getElementById('form');
const error_message = document.getElementById('error-message');
let selected_rows = [];

/* Funciones del Main */
window.openMenu = openMenu;
window.loadProductInfo = loadProductInfo;
window.loadProducts = loadProducts;
window.addProductToTable = addProductToTable;
window.deleteAllProductsOnTable = deleteAllProductsOnTable;
window.clearName = clearName;
window.deleteProductFromTable = deleteProductFromTable;
window.forEachTable = forEachTable;
window.clearErrorMessage = errorMessage;
window.toggleInterface = toggleInterface;

/* Funciones de Api */
window.getProducts = api.getProducts;
window.getProductsNames = api.getProductsNames;
window.getStock = api.getStock;

try {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        errorMessage(error_message);

        const name_client = form.name_client.value;
        const products_table = form.products_table;
    });
} catch (error) {
    console.log('error de evento del form', error);
}

function openMenu() {
    menu_option.classList.toggle("show");
    icon_option.classList.toggle("rotate");
}

async function loadProductInfo(select, price, Stock) {
    errorMessage(error_message);

    const select_product = document.getElementById(`${select}`);
    const precio = document.getElementById(`${price}`);
    const stock = document.getElementById(`${Stock}`);

    const products = await api.getProducts();

    const product = products.find(item => item.id == select_product.value);

    if (product) {
        precio.textContent = 'S/. ' + product.precio;
        stock.textContent = product.stock;
    } else {
        errorMessage(error_message, 'Error al cargar el producto.');
        precio.textContent = 'S/. ' + 0;
        stock.textContent = 0;
    }
}

async function addProductToTable(tabla, select, cantidad) {
    errorMessage(error_message);

    const table = document.getElementById(`${tabla}`);
    const product_id = parseInt(document.getElementById(`${select}`).value);
    const cant = parseInt(document.getElementById(`${cantidad}`).value);
    const totalHTML = document.getElementById('total');
    const stockHTML = document.getElementById('stock');

    console.log(product_id, cant);

    if ( !product_id || !cant || cant <= 0 ) {
        errorMessage(error_message, 'Error al seleccionar producto o en la cantidad.');
        return;
    };

    const generator_id = forEachTable(table);
    let id = generator_id.next();

    while ( !id.done ) {
        const cells = id.value;
        const row_id = parseInt(cells[0].textContent);

        if ( row_id == product_id ) {
            const old_cant = parseInt(cells[3].textContent);
            const price = parseFloat(cells[2].textContent.match(/\d+(?:\.\d{0,2})?/));
            const old_total = parseFloat(totalHTML.textContent.match(/\d+(?:\.\d{0,2})?/));

            const new_cant = old_cant + cant;
            const new_subtotal = new_cant * price;
            const new_total = old_total + price * cant;

            if ( new_cant > parseInt(stockHTML.textContent) ) {
                errorMessage(error_message, 'No hay suficiente stock.');
                return;
            }

            cells[3].textContent = new_cant;
            cells[4].textContent = 'S/. ' + new_subtotal.toFixed(2);
            totalHTML.textContent = 'S/. ' + new_total.toFixed(2);
            return;
        }
        id = generator_id.next();
    }

    let subtotal = 0;

    const tr = document.createElement('tr');
    const td_id = document.createElement('td');
    const td_product = document.createElement('td');
    const td_price = document.createElement('td');
    const td_stock = document.createElement('td');
    const td_subtotal = document.createElement('td');
    const button_delete = document.createElement('button');
    
    button_delete.textContent = 'X';

    tr.classList.add('border-bottom');
    tr.classList.add('table-products-item');
    button_delete.classList.add('button-delete');
    button_delete.classList.add('transform-right10');
    button_delete.setAttribute('type', 'button');
    button_delete.setAttribute('onclick', 'deleteProductFromTable(this)');

    td_id.classList.add('border-right');
    td_price.classList.add('border-left');
    td_stock.classList.add('border-left');
    td_subtotal.classList.add('border-left');

    td_id.classList.add('font13');
    td_product.classList.add('font13');
    td_price.classList.add('font13');
    td_stock.classList.add('font13');
    td_subtotal.classList.add('font13');

    const products = await api.getProducts();

    const product = products.find(item => item.id == product_id);

    if ( product ) {
        td_id.textContent = product.id;
        td_product.textContent = product.nombre;
        td_price.textContent = 'S/. ' +  product.precio;
        td_stock.textContent = cant;

        const tbody = table.children[1];

        subtotal = cant * product.precio;
        td_subtotal.textContent = ('S/. ' + subtotal.toFixed(2));

        tbody.appendChild(tr);
        tr.appendChild(button_delete);
        tr.appendChild(td_id);
        tr.appendChild(td_product);
        tr.appendChild(td_price);
        tr.appendChild(td_stock);
        tr.appendChild(td_subtotal);

        let total = parseFloat(totalHTML.textContent.match(/\d+(?:\.\d{0,2})?/)) + subtotal;

        totalHTML.textContent = 'S/. ' + total.toFixed(2);
    } else {
        errorMessage(error_message, 'Error al cargar el producto.');
        return
    }
}

function deleteAllProductsOnTable(tabla) {
    errorMessage(error_message);

    const table = document.getElementById(`${tabla}`);
    const tbody = table.children[1];
    const tfoot = table.children[2];
    tbody.innerHTML = '';
    tfoot.children[0].children[1].textContent = 'S/. ' + 0;
}

function clearName(input) {
    errorMessage(error_message);

    document.getElementById(`${input}`).value = '';
}

function deleteProductFromTable(button) {
    errorMessage(error_message);

    const tr = button.parentElement;
    const tbody = tr.parentElement;
    const totalHTML = document.getElementById('total');
    const total = parseFloat(totalHTML.textContent.match(/\d+(?:\.\d{0,2})?/)) - parseFloat(tr.children[5].textContent.match(/\d+(?:\.\d{0,2})?/));
    totalHTML.textContent = 'S/. ' + total.toFixed(2);
    tbody.removeChild(tr);
}

function* forEachTable( table ) {
    const rows = table.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        if ( cells.length > 0 ) {
            yield cells;
        }
    }
}

function errorMessage(p, message = '') {
    p.textContent = message;
}

async function loadProducts( tabla ) {
    const table = document.getElementById(`${tabla}`);
    const isEmpty = table.querySelector('tbody').children.length < 1;

    if ( !isEmpty ) {
        return;
    }

    const products = await api.getProducts();

    products.forEach(product => {
        const tr = document.createElement('tr');
        const td_id = document.createElement('td');
        const td_product = document.createElement('td');
        const td_price = document.createElement('td');
        const td_stock = document.createElement('td');
        const td_mark = document.createElement('td');

        tr.classList.add('border-bottom');
        tr.classList.add('table-products-item');

        td_id.classList.add('border-right');
        td_price.classList.add('border-left');
        td_stock.classList.add('border-left');
        td_mark.classList.add('border-left');

        td_id.classList.add('font13');
        td_product.classList.add('font13');
        td_price.classList.add('font13');
        td_stock.classList.add('font13');
        td_mark.classList.add('font13');

        td_id.textContent = (product.id).toString().padStart(4, '0');
        td_product.textContent = product.nombre;
        td_price.textContent = 'S/. ' +  product.precio;
        td_stock.textContent = product.stock;
        td_mark.textContent = product.marca;

        table.children[1].appendChild(tr);
        tr.appendChild(td_id);
        tr.appendChild(td_product);
        tr.appendChild(td_price);
        tr.appendChild(td_stock);
        tr.appendChild(td_mark);
    })

    try {
        table.querySelectorAll('tbody tr').forEach(tr => tr.addEventListener('click', function() { 
            const row = this;
            row.classList.toggle('selected-row');

            if (selected_rows.includes(row)) {
                selected_rows = selected_rows.filter(r => r !== row);
            } else
                selected_rows.push(row); 
        }));
    } catch (error) {
        console.log('error de evento de selected_rows', error);
    }
}

function toggleInterface( obj ) {
    const intface = document.getElementById(`${obj}`);
    intface.classList.toggle('hidden');
}