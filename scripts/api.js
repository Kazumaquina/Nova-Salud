const form = document.getElementById('form');
export function updateProduct(productData) { // Recibe un objeto con los datos del producto actualizado (incluyendo el ID)
    fetch('/products-api', { // <-- Esta es la ruta que usaremos para actualizar productos en el servidor
        method: 'PUT', // Usamos el método PUT para indicar que estamos actualizando un recurso existente
        headers: {
            'Content-Type': 'application/json' // Le decimos al servidor que le enviaremos datos en formato JSON
        },
        body: JSON.stringify(productData) // Convertimos el objeto de datos (id, nombre, marca, precio, stock) a JSON para enviar
    })
    .then(response => {
        // Manejar la respuesta del servidor (éxito o error)
        if (!response.ok) throw new Error('Error al obtener productos');
        return response.json();
        // Si la respuesta fue OK (ej: 200), leemos el cuerpo como texto (esperando un mensaje de éxito del backend)
    })
    .then(msg => { // Recibe el mensaje (éxito o error)
        console.log(msg); // Lo muestra en una alerta al usuario
        // Si la actualización fue exitosa, la lógica en main.js (después de llamar a esta función)
        // debería limpiar el formulario o recargar la lista.
    })
    .catch(error => { // Si falla la comunicación, el servidor dio error, o hubo un error en los .then anteriores
        console.error('Error al actualizar el producto:', error); // Logea el error completo
    });
}
export function saveSale(name_client, products_list) { // Recibe el nombre y la lista de productos
    fetch('/register-sale', { // <-- Apunta a la nueva ruta que crearás en routes.js
        method: 'POST', // Usamos POST para enviar datos
        headers: {
            'Content-Type': 'application/json' // Le decimos al servidor que enviaremos JSON
        },
        body: JSON.stringify({ // Convierte los datos a JSON para enviar
            clientName: name_client, // Nombre del cliente
            products: products_list  // Lista de productos
        })
    })
    .then(response => {
        if (!response.ok) throw new Error('Error al guardar la venta');
        return response.text();
    })
    .then(msg => { // Recibe el mensaje (éxito o error)
        alert(msg); // Lo muestra en una alerta
        // Aquí podrías llamar a una función en main.js para limpiar la interfaz si el mensaje es de éxito
    })
    .catch(error => { // Si falla la comunicación o el servidor dio error
        alert('Hubo un error al guardar la venta: ' + error.message); // Muestra error
        console.error('Error al guardar la venta:', error);
    });
}

export function getStock(obj) {
    const input = document.getElementById(`${obj}`);
    const id = input.parentElement.querySelector('select').value;

    fetch('/stock', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    })
    .then(response => {
        if (!response.ok) throw new Error('Error al obtener el stock');
        return response.text();
    })
    .then(max => {
        input.setAttribute('max', max);
    })
    .catch(error => {
        alert('Hubo un error al enviar los datos.');
        console.error(error);
    });
}

export function getProductsNames(obj) {
    const select = document.getElementById(`${obj}`);

    fetch('/products_names')
    .then(response => {
        if (!response.ok) throw new Error('Error al obtener los nombres de los productos');
        return response.json();
    })
    .then(items => {
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.nombre;
            select.appendChild(option);
        });
    })
    .catch(error => {
        alert('Hubo un error al enviar los datos.');
        console.error(error);
    });
}

export async function getProducts() {
    let productos;
    await fetch('/products')
    .then(response => {
        if (!response.ok) throw new Error('Error al obtener productos');
        return response.json();
    })
    .then(items => {
        productos = items;
    })
    .catch(error => {
        alert('Hubo un error al enviar los datos.');
        console.error(error);
        return
    });

    return productos;
}