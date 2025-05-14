import * as api from './api.js';
const formUpdate = document.getElementById('form-update');
const formDelete = document.getElementById('form-delete');
const menu_option = document.getElementById("menu-option");
const icon_option = document.querySelector('.button-menu-display img');
const form = document.getElementById('form');
const form_add_product = document.getElementById('form_add_product');
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
window.errorMessage = errorMessage;
window.toggleInterface = toggleInterface;
window.restoreTableOfInterface = restoreTableOfInterface;
window.searchProduct = searchProduct;
window.deleteSelectedProducts = deleteSelectedProducts;
/* Funciones de Api */
window.getProducts = api.getProducts;
window.getProductsNames = api.getProductsNames;
window.getStock = api.getStock;
window.addProduct = api.addProduct;
try {
    formUpdate.addEventListener('submit', function(e) {
        e.preventDefault();
        const error_update = document.getElementById('error_message_update');
        errorMessage(error_update);
        if ( selected_rows.length === 0 ) {
            errorMessage(error_update, 'Debe seleccionar al menos un producto.');
            return;
        }
        const productIdToUpdate = parseInt(selected_rows[0].children[0].textContent);
        const newName = document.getElementById('name_product_update').value;
        const newMark = document.getElementById('name_mark_update').value;
        const newPrice = parseFloat(document.getElementById('price_update').value);
        const newStock = parseInt(document.getElementById('stock_update').value);
        if (isNaN(productIdToUpdate) || productIdToUpdate <= 0) {
            errorMessage(error_update, 'Debe especificar un ID valido para actualizar.');
            return;
        }
        if (newName.trim() === '' || newMark.trim() === '') {
            errorMessage(error_update, 'Nombre y Marca no pueden estar vacios.');
            return;
        }
        if (isNaN(newPrice) || newPrice < 0) {
            errorMessage(error_update, 'Precio invalido.');
            return;
        }
         if (isNaN(newStock) || newStock < 0) {
            errorMessage(error_update, 'Stock invalido.');
            return;
        }
        const updatedProductData = {
            id: productIdToUpdate,
            nombre: newName,
            marca: newMark,
            precio: newPrice,
            stock: newStock
        };
        api.updateProduct(updatedProductData);
        loadProducts('products_table');
        document.getElementById('name_product_update').value = '';
        document.getElementById('name_mark_update').value = '';
        document.getElementById('price_update').value = '';
        document.getElementById('stock_update').value = '';
        selected_rows = [];
    });
} catch (error) {
    console.error('Error en el evento submit del formulario de actualizacion:', error);
}
try {
    form_add_product.addEventListener('submit', async function(e) {
        e.preventDefault();
        errorMessage(error_message);
        const name = document.getElementById('name_product_add').value;
        const mark = document.getElementById('name_mark_add').value;
        const price = parseFloat(document.getElementById('name_price_add').value);
        const stock = parseInt(document.getElementById('name_stock_add').value);
        if (name.trim() === '' || mark.trim() === '') {
            errorMessage(error_message, 'Nombre y Marca no pueden estar vacíos.');
            return;
        }
        if (isNaN(price) || price <= 0) {
            errorMessage(error_message, 'Precio inválido. Debe ser mayor que 0.');
            return;
        }
        if (isNaN(stock) || stock < 0) {
            errorMessage(error_message, 'Stock inválido. Debe ser 0 o más.');
            return;
        }
        const newProductData = {
            nombre: name,
            marca: mark,
            precio: price,
            stock: stock
        };
        try {
        const successMessage = await api.addProduct(newProductData);
        console.log('Producto añadido con éxito:', successMessage);
        errorMessage(error_message, 'Éxito: ' + successMessage);
        form_add_product.reset();
        loadProducts('productos');
        } catch (error) {
             console.error('Error al añadir producto:', error);
        const displayMessage = error.message || 'Ocurrió un error desconocido al añadir el producto.';
        errorMessage(error_message, 'Error: ' + displayMessage);
        }
    });
} catch (error) {
    console.error('Error al configurar el listener del formulario de añadir producto:', error);
}
try {
    formDelete.addEventListener('submit', function(e) {
        e.preventDefault();
        const error_delete = document.getElementById('error_message_delete');
        if ( selected_rows.length === 0 ) {
            errorMessage(error_delete, 'Debe seleccionar al menos un producto.');
            return;
        }
        const confirm_delete = document.getElementById('confirm-interface');
        const table_confirm = document.getElementById('products_table_delete_confirm');
        deleteAllProductsOnTable(table_confirm.id);
        errorMessage(error_delete);
        confirm_delete.classList.remove('hidden');
        console.log(selected_rows.length);
        selected_rows.forEach(row => {
            table_confirm.querySelector('tbody').appendChild(row.cloneNode(true));
        });
    });
} catch (error) {
    console.error('Error en el evento submit del formulario de eliminacion:', error);
}
try {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        errorMessage(error_message);
        const name_client = document.getElementById('name_client').value;
        const productsTableElement = document.getElementById('products_table');
        const tbody = productsTableElement.querySelector('tbody');
        const rows = tbody.querySelectorAll('tr');
        let products_for_sale = [];
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 0) {
                const productId = parseInt(cells[0].textContent);
                const productName = cells[1].textContent;
                const productPrice = parseFloat(cells[2].textContent.replace('S/. ', ''));
                const quantity = parseInt(cells[3].textContent);
                const subTotal = parseFloat(cells[4].textContent.replace('S/. ', ''));
                products_for_sale.push({
                    id: productId,
                    nombre: productName,
                    precio: productPrice,
                    cantidad: quantity,
                    subtotal: subTotal
                });
            }
        });
        if (name_client.trim() === '' || products_for_sale.length === 0) {
            errorMessage(error_message, 'Nombre del cliente y/o productos faltantes.');
            return;
        }
        api.saveSale(name_client, products_for_sale);
        deleteAllProductsOnTable('products_table');
        document.getElementById('name_client').value = '';
    });
} catch (error) {
    console.error('Error en el evento submit del formulario de venta', error)
}
try {
    form_add_product.addEventListener('submit', function(e) {
        e.preventDefault();
        errorMessage(error_message);
        const productsTableElement = document.getElementById('productos');
        const tbody = productsTableElement.querySelector('tbody');
        const rows = tbody.querySelectorAll('tr');
    });
} catch (error) {
    console.error('Error en el evento submit del formulario de venta', error);
}
async function deleteSelectedProducts() {
    const errorDelete = document.getElementById('error_message_delete');
    const errorGlobal = document.getElementById('error-message');
    const errorUpdate = document.getElementById('error_message_update');
    if (errorDelete) errorMessage(errorDelete, '');
    if (errorGlobal) errorMessage(errorGlobal, '');
    if (errorUpdate) errorMessage(errorUpdate, '');
    if (selected_rows.length === 0) {
         if (errorDelete) errorMessage(errorDelete, 'Debe seleccionar al menos un producto para eliminar.');
         toggleInterface('confirm-interface');
         return;
    }
    const productIdsToDelete = selected_rows.map(row => {
        const productId = parseInt(row.dataset.productId);
        return productId;
    }).filter(id => !isNaN(id) && id > 0);
    if (productIdsToDelete.length === 0) {
        if (errorDelete) errorMessage(errorDelete, 'Ninguno de los productos seleccionados tenía un ID válido.');
        toggleInterface('confirm-interface');
        return;
    }
    try {
        const successMessage = await api.deleteProducts(productIdsToDelete);
        console.log('Eliminación exitosa:', successMessage);
        toggleInterface('confirm-interface');
        loadProducts('productos');
        loadProducts('products_table');
        loadProducts('products_table_delete');
        selected_rows.forEach(row => row.classList.remove('selected-row'));
        selected_rows = [];
    } catch (error) {
        console.error('Error al eliminar productos (manejado en main.js):', error);
        const displayMessage = error.message || 'Ocurrió un error desconocido al eliminar productos.';
        if (errorDelete) errorMessage(errorDelete, 'Error: ' + displayMessage);
        toggleInterface('confirm-interface');
        loadProducts('productos');
        loadProducts('products_table');
        loadProducts('products_table_delete');
    }
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
    const tbody = table.querySelector('tbody');
    const tfoot = table.querySelector('tfoot');
    if ( tfoot ) {
        tfoot.children[0].children[1].textContent = 'S/. ' + 0;
    }
    tbody.innerHTML = '';
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
async function loadProducts(tablaId) {
    const table = document.getElementById(tablaId);
    if (!table) {
        console.error(`Tabla con ID ${tablaId} no encontrada.`);
        return;
    }
    const tbody = table.querySelector('tbody');
    if (!tbody) {
        console.error(`Tbody no encontrado en la tabla ${tablaId}.`);
        return;
    }
    tbody.innerHTML = '';
    errorMessage(error_message);
    try {
        const products = await api.getProducts();
        products.forEach(product => {
            const tr = document.createElement('tr');
            tr.classList.add('border-bottom', 'table-products-item');
            tr.dataset.productId = product.id;
            const td_id = document.createElement('td');
            const td_product = document.createElement('td');
            const td_price = document.createElement('td');
            const td_stock = document.createElement('td');
            const td_mark = document.createElement('td');
            td_id.classList.add('border-right', 'font13');
            td_product.classList.add('font13');
            td_price.classList.add('border-left', 'font13');
            td_stock.classList.add('border-left', 'font13');
            td_mark.classList.add('border-left', 'font13');
            td_id.textContent = product.id;
            td_product.textContent = product.nombre;
            td_price.textContent = 'S/. ' + parseFloat(product.precio).toFixed(2);
            td_stock.textContent = product.stock;
            td_mark.textContent = product.marca;
            tr.appendChild(td_id);
            tr.appendChild(td_product);
            tr.appendChild(td_price);
            tr.appendChild(td_stock);
            tr.appendChild(td_mark);
            tbody.appendChild(tr);
            if (tablaId === 'products_table' || tablaId === 'products_table_delete') {
                tr.addEventListener('click', function() {
                    const clickedRow = this;
                    const isSelected = clickedRow.classList.contains('selected-row');
                    if (tablaId === 'products_table') {
                        table.querySelectorAll('tbody tr.selected-row').forEach(r => {
                            if (r !== clickedRow) r.classList.remove('selected-row');
                        });
                        if (isSelected) {
                            clickedRow.classList.remove('selected-row');
                            selected_rows = [];
                            document.getElementById('form-update').reset();
                        } else {
                            clickedRow.classList.add('selected-row');
                            selected_rows = [clickedRow];
                            document.getElementById('name_product_update').value = product.nombre;
                            document.getElementById('name_mark_update').value = product.marca;
                            document.getElementById('price_update').value = parseFloat(product.precio).toFixed(2);
                            document.getElementById('stock_update').value = product.stock;
                        }
                    } else if (tablaId === 'products_table_delete') {
                        clickedRow.classList.toggle('selected-row');
                        if (clickedRow.classList.contains('selected-row')) {
                            if (!selected_rows.includes(clickedRow)) selected_rows.push(clickedRow);
                        } else {
                            selected_rows = selected_rows.filter(r => r !== clickedRow);
                        }
                    }
                });
            }
        });
    } catch (error) {
        console.error(`Error cargando productos en tabla ${tablaId}:`, error);
        errorMessage(error_message, 'Error al cargar la lista de productos.');
    }
}
function toggleInterface( obj ) {
    const intface = document.getElementById(`${obj}`);
    intface.classList.toggle('hidden');
}
function restoreTableOfInterface() {
    selected_rows.forEach(row => row.classList.remove('selected-row'));
    selected_rows = [];
}
function searchProduct(tabla, inputs) {
    let inputs_search = [];
    let rows_not_found = [];
    let rows_found = [];
    const table = document.getElementById(tabla);
    const id = document.getElementById(inputs[0]).value;
    const name = document.getElementById(inputs[1]).value;
    const price = document.getElementById(inputs[2]).value;
    const stock = document.getElementById(inputs[3]).value;
    const mark = document.getElementById(inputs[4]).value;
    if (id.trim() !== '') inputs_search.push({ location: 0, value: id });
    if (name.trim() !== '') inputs_search.push({ location: 1, value: name });
    if (price.trim() !== '') inputs_search.push({ location: 2, value: price });
    if (stock.trim() !== '') inputs_search.push({ location: 3, value: stock });
    if (mark.trim() !== '') inputs_search.push({ location: 4, value: mark });
    if (inputs_search.length === 0) {
        loadProducts(tabla);
        return;
    }
    const generator = forEachTable(table);
    let row = generator.next();
    while ( !row.done ) {
        let verify = true;
        const cells = row.value;
        inputs_search.forEach(input => {
            if (!cells[input.location].textContent.toLowerCase().includes(input.value.toLowerCase())) {
                verify = false;
            }
        });
        if ( verify ) {
            rows_found.push(cells);
        } else {
            rows_not_found.push(cells);
        }
        row = generator.next();
    }
    rows_not_found.forEach(row => {
        row[0].parentElement.classList.add('display-none');
        row[0].parentElement.classList.remove('selected-row');
        selected_rows = selected_rows.filter(r => r !== row[0].parentElement);
    });
    rows_found.forEach(row => {
        row[0].parentElement.classList.remove('display-none');
    });
}