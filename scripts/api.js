const form = document.getElementById('form');
export function updateProduct(productData) {
    fetch('/products-api', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
    })
    .then(response => {
        if (!response.ok) throw new Error('Error al obtener productos');
        return response.json();
    })
    .then(msg => {
        console.log(msg);
    })
    .catch(error => {
        console.error('Error al actualizar el producto:', error);
    });
}
export function saveSale(name_client, products_list) {
    fetch('/register-sale', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            clientName: name_client,
            products: products_list
        })
    })
    .then(response => {
        if (!response.ok) throw new Error('Error al guardar la venta');
        return response.text();
    })
    .then(msg => {
        alert(msg);
    })
    .catch(error => {
        alert('Hubo un error al guardar la venta: ' + error.message);
        console.error('Error al guardar la venta:', error);
    });
}
export function addProduct(productData) {
     return fetch('/products-api', {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json'
         },
         body: JSON.stringify(productData)
     })
     .then(response => {
         if (!response.ok) {
              return response.text().then(text => {
                   const errorDetail = text || response.statusText;
                   const error = new Error(errorDetail);
                   error.status = response.status;
                   throw error;
              });
         }
         return response.text();
     });
 }
export function deleteProducts(productIds) {
     return fetch('/products-api', {
         method: 'DELETE',
         headers: {
             'Content-Type': 'application/json'
         },
         body: JSON.stringify({ ids: productIds })
     })
     .then(response => {
         if (!response.ok) {
              return response.text().then(text => {
                   const errorDetail = text || response.statusText;
                   const error = new Error(errorDetail);
                   error.status = response.status;
                   throw error;
              });
         }
         return response.text();
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