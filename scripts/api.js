const form = document.getElementById('form');

export function saveSale(name_client, products_table) {
    let products = [];

    let verif = [true, metodo];

    if ( name_client.trim() === '' ) {
        verif[0] = false;
        alert('El nombre del cliente no puede estar vacio.');
    }

    for (let i = 0; i < products_table.length; i++) {
        if (products_table[i].checked) {
            products.push(products_table[i].value);
            console.log(products[i]);
        }
    }

    if ( verif[0] ) {
        fetch('/enviar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name_client, products })
        })
        .then(response => {
            if (!response.ok) throw new Error('Error en el envío');
            return response.text();
        })
        .then(msg => {
            alert(msg);
            form.reset();
        })
        .catch(error => {
            alert('Hubo un error al enviar los datos.');
            console.error(error);
        });
    }
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
        if (!response.ok) throw new Error('Error en el envío');
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
        if (!response.ok) throw new Error('Error en el envío');
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
        if (!response.ok) throw new Error('Error en el envío');
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