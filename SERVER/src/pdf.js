const PdfPrinter = require('pdfmake');
const path = require('path');

const fonts = {
    Roboto: {
        normal: path.join(__dirname, 'fonts/Roboto-Regular.ttf'),
        bold: path.join(__dirname, 'fonts/Roboto-Medium.ttf'),
        italics: path.join(__dirname, 'fonts/Roboto-Italic.ttf'),
        bolditalics: path.join(__dirname, 'fonts/Roboto-MediumItalic.ttf')
    }
};

const printer = new PdfPrinter(fonts);

function generateInvoicePdf(saleDetails) {
    
    if (!saleDetails || !saleDetails.productos || !Array.isArray(saleDetails.productos)) {
        console.error("Datos de venta inválidos para generar PDF:", saleDetails);
        throw new Error("Datos de venta incompletos o inválidos para generar PDF.");
    }

    const documentDefinition = {
        content: [
            { text: 'Factura de Venta', style: 'header' },
            { text: `Factura #: ${saleDetails.id}`, alignment: 'right' },
            { text: `Fecha: ${saleDetails.fecha instanceof Date ? saleDetails.fecha.toLocaleString() : saleDetails.fecha}`, alignment: 'right' },
            { text: `Cliente: ${saleDetails.clienteNombre}`, margin: [0, 10, 0, 20] },
            {
                table: {
                    headerRows: 1,
                    widths: ['auto', '*', 'auto', 'auto', 'auto'],
                    body: [
                        ['ID', 'Producto', 'Cantidad', 'Precio Unitario', 'SubTotal'],
                        ...saleDetails.productos.map(item => [
                            item.id,
                            `${item.nombre} (${item.marca})`,
                            item.cantidad,
                            `S/. ${parseFloat(item.precio_unitario).toFixed(2)}`,
                            `S/. ${parseFloat(item.subtotal).toFixed(2)}`
                        ]),
                        
                        [{ text: 'Total', colSpan: 4, alignment: 'right', bold: true }, {}, {}, {}, { text: `S/. ${parseFloat(saleDetails.total).toFixed(2)}`, bold: true }]
                    ]
                },
                layout: { 
                    fillColor: function (rowIndex, node, columnIndex) {
                        return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
                    },
                    hLineWidth: function (i, node) { return (i === 0 || i === node.table.body.length) ? 2 : 1; },
                    vLineWidth: function (i, node) { return (i === 0 || i === node.table.widths.length) ? 2 : 1; },
                    hLineColor: function (i, node) { return (i === 0 || i === node.table.body.length) ? '#000000' : '#aaaaaa'; },
                    vLineColor: function (i, node) { return (i === 0 || i === node.table.widths.length) ? '#000000' : '#aaaaaa'; },
                    paddingLeft: function(i, node) { return 8; },
                    paddingRight: function(i, node) { return 8; },
                    paddingTop: function(i, node) { return 8; },
                    paddingBottom: function(i, node) { return 8; },
                }
            }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 20]
            }
        },
         defaultStyle: {
            font: 'Roboto'
        }
    };

    const pdfDoc = printer.createPdfKitDocument(documentDefinition);

    return pdfDoc;
}

module.exports = {
    generateInvoicePdf
};