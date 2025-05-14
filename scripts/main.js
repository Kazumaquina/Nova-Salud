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
    form_add_product.addEventListener('submit', function(e) { // Listener para el formulario de AÑADIR producto
        e.preventDefault(); // Evita que la página se recargue
        errorMessage(error_message); // Limpia mensajes previos

        // --- Recolectar datos del formulario de AÑADIR producto ---
        const name = document.getElementById('name_product_add').value;
        const mark = document.getElementById('name_mark_add').value;
        const price = parseFloat(document.getElementById('name_price_add').value);
        const stock = parseInt(document.getElementById('name_stock_add').value);

        // --- Validar datos básicos antes de enviar ---
        if (name.trim() === '' || mark.trim() === '') {
            errorMessage(error_message, 'Nombre y Marca no pueden estar vacíos.');
            return;
        }
        if (isNaN(price) || price <= 0) { // Asumiendo que el precio debe ser mayor que 0
            errorMessage(error_message, 'Precio inválido.');
            return;
        }
        if (isNaN(stock) || stock < 0) { // Asumiendo que el stock puede ser 0 o más
            errorMessage(error_message, 'Stock inválido.');
            return;
        }

        // --- Crear el objeto con los datos del nuevo producto para enviar a la API ---
        const newProductData = {
            nombre: name,
            marca: mark,
            precio: price,
            stock: stock
        };

        // --- Llamar a la funcion de API para añadir el producto (la crearemos en api.js) ---
        api.addProduct(newProductData);

        // --- Acciones despues de intentar enviar (opcional, puedes ajustar) ---
        form_add_product.reset(); // Limpia los campos del formulario de añadir producto
        // Opcional: recargar la lista de productos en la tabla principal para ver el nuevo producto
         // loadProducts('productos'); // Asumiendo que 'productos' es el ID de la tabla principal

    });
} catch (error) {
    console.error('Error en el evento submit del formulario de añadir producto:', error);
    errorMessage(error_message, 'Ocurrio un error inesperado al procesar para añadir producto.');
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

try {
    form_add_product.addEventListener('submit', function(e) {
        e.preventDefault();
        errorMessage(error_message);

        const productsTableElement = document.getElementById('productos'); // Obtiene la tabla de productos
        const tbody = productsTableElement.querySelector('tbody'); // Obtiene el cuerpo de la tabla
        const rows = tbody.querySelectorAll('tr'); // Obtiene las filas de productos

    });
} catch (error) {
    errorMessage(error_message, 'Ocurrio un error inesperado.');
}

async function deleteSelectedProducts() {
    // Limpiar mensajes de error relevantes ANTES de iniciar la operación
    // Asegúrate de que estos elementos de mensaje existan en tu HTML
    const errorDelete = document.getElementById('error_message_delete'); // Mensaje en interfaz delete
    const errorGlobal = document.getElementById('error-message'); // Mensaje global si lo usas
    const errorUpdate = document.getElementById('error_message_update'); // Mensaje en interfaz update

    // Si los elementos existen, limpiarlos.
    if (errorDelete) errorMessage(errorDelete, '');
    if (errorGlobal) errorMessage(errorGlobal, '');
    if (errorUpdate) errorMessage(errorUpdate, '');


    // Validar si hay filas seleccionadas antes de continuar
    if (selected_rows.length === 0) {
         // Si no hay nada seleccionado, muestra un mensaje y cierra la confirmación (si está abierta)
         if (errorDelete) errorMessage(errorDelete, 'Debe seleccionar al menos un producto para eliminar.');
         toggleInterface('confirm-interface'); // Asegúrate de que toggleInterface existe
         return; // Detiene la ejecución si no hay selección
    }

    // Obtener los IDs de los productos seleccionados de la lista selected_rows
    const productIdsToDelete = selected_rows.map(row => {
        // Obtenemos el ID del atributo data-productId de la fila (añadido en loadProducts)
        const productId = parseInt(row.dataset.productId);
        return productId;
    }).filter(id => !isNaN(id) && id > 0); // Filtrar IDs que no son números válidos o son <= 0

    // Si no se encontraron IDs válidos entre las filas seleccionadas
    if (productIdsToDelete.length === 0) {
        if (errorDelete) errorMessage(errorDelete, 'Ninguno de los productos seleccionados tenía un ID válido.');
        toggleInterface('confirm-interface'); // Cierra la confirmación
        // Opcional: Limpiar la lista visual y lógica de selected_rows
        // selected_rows.forEach(row => row.classList.remove('selected-row'));
        // selected_rows = [];
        return; // Detiene la ejecución
    }

    // --- Llamar a la función de API para eliminar productos y manejar la respuesta ---
    try {
        // Llama a api.deleteProducts y ESPERA su respuesta.
        // api.deleteProducts ahora lanza un error si la respuesta del servidor no es OK.
        // Si se resuelve sin error, successMessage contendrá el texto de éxito del backend.
        const successMessage = await api.deleteProducts(productIdsToDelete);

        // --- Si llegamos aquí, la eliminación fue EXITOSA ---
        console.log('Eliminación exitosa:', successMessage); // Log de consola para verificar

        // 1. Mostrar mensaje de éxito (en el DOM)
        // Puedes mostrarlo en el mensaje de error de la interfaz de delete o en el mensaje global.
         if (errorDelete) errorMessage(errorDelete, 'Éxito: ' + successMessage);
        // if (errorGlobal) errorMessage(errorGlobal, 'Éxito al eliminar: ' + successMessage); // O usar el global

        // 2. Cerrar la interfaz de confirmación ("Are you sure...")
        toggleInterface('confirm-interface'); // Asegúrate de que toggleInterface existe

        // 3. Recargar TODAS las tablas relevantes para reflejar los cambios en la lista de productos
        // Asegúrate de que loadProducts existe y funciona correctamente con los IDs de tabla
        loadProducts('productos'); // La tabla principal de añadir producto
        loadProducts('products_table'); // La tabla en la interfaz de actualizar
        loadProducts('products_table_delete'); // La tabla en la interfaz de eliminar

        // 4. Limpiar la lista de filas seleccionadas global y visualmente
        selected_rows.forEach(row => row.classList.remove('selected-row')); // Quita la clase visual
        selected_rows = []; // Limpia el array


        // Opcional: Cerrar la interfaz de eliminación principal (#interface-delete) también en caso de éxito
        // toggleInterface('interface-delete');


    } catch (error) {
        // --- Si llegamos aquí, la eliminación FALLÓ (api.deleteProducts lanzó un error) ---
        console.error('Error al eliminar productos (manejado en main.js):', error);

        // 1. Mostrar mensaje de error (en el DOM)
        // Usamos el mensaje que api.js incluyó en el objeto Error lanzado.
        const displayMessage = error.message || 'Ocurrió un error desconocido al eliminar productos.';
        // Mostrar en el mensaje específico de la interfaz de delete
        if (errorDelete) errorMessage(errorDelete, 'Error: ' + displayMessage);
        // O en el mensaje global si lo usas
        // if (errorGlobal) errorMessage(errorGlobal, 'Error al eliminar: ' + displayMessage);


        // 2. Cerrar la interfaz de confirmación ("Are you sure...")
        toggleInterface('confirm-interface'); // Siempre cerramos la ventana de confirmación al terminar el intento

        // 3. Recargar tablas para mostrar el estado actual (cuáles NO se eliminaron si hubo error, ej. clave foránea)
        loadProducts('productos');
        loadProducts('products_table');
        loadProducts('products_table_delete');

        // 4. Las filas seleccionadas se mantienen visualmente y en el array selected_rows
        // para que el usuario vea cuáles fallaron o si quiere reintentar/investigar.
        // Si prefieres limpiar la selección incluso en caso de error, descomenta:
        // selected_rows.forEach(row => row.classList.remove('selected-row'));
        // selected_rows = [];
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