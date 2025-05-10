const form = document.getElementById('form');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name_client = form.name_client.value.trim();
    const products_table = form.products_table;
    const metodo = form.metodo.value;
    let products = [];

    let verif = [true, metodo];

    for (let i = 0; i < products_table.length; i++) {
        if (products_table[i].checked) {
            products.push(products_table[i].value);
            console.log(products[i]);
        }
    }

    if ( name_client === '' ) {
        alert('El campo de nombre es obligatorio.');
        verif[0] = false;
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
});

function getStock(obj) {
    const input = document.getElementById(`${obj}`);
    const product = input.parentElement.querySelector('select').value;
    console.log(product);

    fetch('/stock', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product })
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

function getProducts(obj) {
    const select = document.getElementById(`${obj}`);

    fetch('/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bool: true })
    })
    .then(response => {
        if (!response.ok) throw new Error('Error en el envío');
        return response.json();
    })
    .then(items => {
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            select.appendChild(option);
        });
    })
    .catch(error => {
        alert('Hubo un error al enviar los datos.');
        console.error(error);
    });
}