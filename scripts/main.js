import * as api from './api.js';

const formUpdate = document.getElementById('form-update');
const formDelete = document.getElementById('form-delete');
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
window.restoreTableOfInterface = restoreTableOfInterface;

/* Funciones de Api */
window.getProducts = api.getProducts;
window.getProductsNames = api.getProductsNames;
window.getStock = api.getStock;

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
         if (isNaN(newStock) || newStock < 0) { // Dependiendo de si permites stock 0
            errorMessage(error_update, 'Stock invalido.');
            return;
        }

        // --- Crear el objeto con los datos actualizados para enviar a la API ---
        const updatedProductData = {
            id: productIdToUpdate, // Incluye el ID para que el backend sepa cuál actualizar
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
    formDelete.addEventListener('submit', function(e) {
        e.preventDefault();
        const error_delete = document.getElementById('error_message_delete');

        errorMessage(error_delete);
    });
} catch (error) {
    console.error('Error en el evento submit del formulario de eliminacion:', error);
}

try {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        errorMessage(error_message);

        const name_client = document.getElementById('name_client').value; // Obtiene el nombre del cliente
        const productsTableElement = document.getElementById('products_table'); // Obtiene la tabla de productos
        const tbody = productsTableElement.querySelector('tbody'); // Obtiene el cuerpo de la tabla
        const rows = tbody.querySelectorAll('tr'); // Obtiene las filas de productos

        let products_for_sale = []; // Lista para guardar los datos de los productos

        // Recorrer cada fila de la tabla para obtener los datos
        rows.forEach(row => {
            const cells = row.querySelectorAll('td'); // Obtiene las celdas de la fila
            if (cells.length > 0) {
                const productId = parseInt(cells[0].textContent); // ID (columna 0)
                const productName = cells[1].textContent; // Nombre (columna 1)
                const productPrice = parseFloat(cells[2].textContent.replace('S/. ', '')); // Precio (columna 2)
                const quantity = parseInt(cells[3].textContent); // Cantidad (columna 3)
                const subTotal = parseFloat(cells[4].textContent.replace('S/. ', '')); // Subtotal (columna 4)

                products_for_sale.push({ // Añade el producto a la lista
                    id: productId,
                    nombre: productName,
                    precio: productPrice,
                    cantidad: quantity,
                    subtotal: subTotal
                });
            }
        });

        // Validación básica (puedes añadir más)
        if (name_client.trim() === '' || products_for_sale.length === 0) {
            errorMessage(error_message, 'Nombre del cliente y/o productos faltantes.');
            return; // Detiene si falta algo
        }

        // Llama a la función en api.js para enviar los datos
        api.saveSale(name_client, products_for_sale);

        deleteAllProductsOnTable('products_table');
        document.getElementById('name_client').value = ''; // Limpiar el input
    });
} catch (error) {
    errorMessage(error_message, 'Ocurrio un error inesperado.');
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

    tbody.innerHTML = ''; // Siempre limpiar la tabla antes de cargar para reflejar cambios CRUD
    errorMessage(error_message); // Limpiar mensajes de error globales

    try {
        const products = await api.getProducts(); // Usar la API real

        products.forEach(product => {
            const tr = document.createElement('tr');
            tr.classList.add('border-bottom', 'table-products-item');
            // Guardar el ID real del producto en el elemento TR para fácil acceso
            tr.dataset.productId = product.id; 

            const td_id = document.createElement('td');
            const td_product = document.createElement('td');
            const td_price = document.createElement('td');
            const td_stock = document.createElement('td');
            const td_mark = document.createElement('td');

            // Aplicar clases CSS
            td_id.classList.add('border-right', 'font13');
            td_product.classList.add('font13');
            td_price.classList.add('border-left', 'font13');
            td_stock.classList.add('border-left', 'font13');
            td_mark.classList.add('border-left', 'font13');

            // Contenido de las celdas
            td_id.textContent = product.id; // Mostrar el ID real. El padding es visual y se puede hacer con CSS si se necesita.
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

            // Añadir event listener para selección y rellenado de formulario (solo para tablas de update/delete)
            if (tablaId === 'products_table' || tablaId === 'products_table_delete') {
                tr.addEventListener('click', function() {
                    const clickedRow = this;
                    const isSelected = clickedRow.classList.contains('selected-row');

                    if (tablaId === 'products_table') { // Interfaz de Actualización (solo una selección)
                        // Deseleccionar todas las demás filas
                        table.querySelectorAll('tbody tr.selected-row').forEach(r => {
                            if (r !== clickedRow) r.classList.remove('selected-row');
                        });
                        
                        if (isSelected) { // Si ya estaba seleccionada, se deselecciona
                            clickedRow.classList.remove('selected-row');
                            selected_rows = [];
                            document.getElementById('form-update').reset(); // Limpiar form de update
                        } else { // Si no estaba seleccionada, se selecciona
                            clickedRow.classList.add('selected-row');
                            selected_rows = [clickedRow];
                            // Rellenar formulario de actualización
                            document.getElementById('name_product_update').value = product.nombre;
                            document.getElementById('name_mark_update').value = product.marca;
                            document.getElementById('price_update').value = parseFloat(product.precio).toFixed(2);
                            document.getElementById('stock_update').value = product.stock;
                        }
                    } else if (tablaId === 'products_table_delete') { // Interfaz de Eliminación (múltiple selección)
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

function searchProduct() {
    let inputs = [];
    const id = document.getElementById('id_product_update_search').value;
    const name = document.getElementById('name_product_update_search').value;
    const mark = document.getElementById('mark_product_update_search').value;
    const price = document.getElementById('price_product_update_search').value;
    const stock = document.getElementById('stock_product_update_search').value;

    if (id.trim() !== '') inputs.push({ name: 'id', data: id });
    if (name.trim() !== '') inputs.push({ name: 'nombre', data: name });
    if (mark.trim() !== '') inputs.push({ name: 'marca', data: mark });
    if (price.trim() !== '') inputs.push({ price: 'precio', data: price });
    if (stock.trim() !== '') inputs.push({ name: 'stock', data: stock });

    api.searchProduct(inputs);
}