document.getElementById("comenzar").addEventListener("click", function () {
    document.getElementById("bienvenida").classList.remove("activa");
    document.getElementById("formulario-seccion").classList.add("activa");
});

document.getElementById("calcular").addEventListener("click", function () {
    const nombre = document.getElementById("nombre").value;
    const Fecha = document.getElementById("Fecha").value;

    const pizza1 = parseFloat(document.getElementById("Pizza1").value) || 0;
    const pizza2 = parseFloat(document.getElementById("Pizza2").value) || 0;
    const pizza3 = parseFloat(document.getElementById("Pizza3").value) || 0;
    const queso1 = document.getElementById("queso1").checked ? 20 : 0;
    const refresco = document.getElementById("refresco").checked ? 15 : 0;
    const orilla = document.getElementById("orilla").checked ? 34 : 0;
    const papas = document.getElementById("papas").checked ? 50 : 0;

    const total = pizza1 + pizza2 + pizza3 + queso1 + refresco + orilla + papas;

    document.getElementById("detalle-seccion").classList.add("activa");
    document.getElementById("formulario-seccion").classList.remove("activa");

    document.getElementById("detallePedido").innerHTML = `
        <strong>Nombre:</strong> ${nombre}<br>
        <strong>Fecha:</strong> ${Fecha}<br>
        <strong>Productos:</strong> 
        <ul>
            <li>Pizza 1 ($${pizza1.toFixed(2)})</li>
            <li>Pizza 2 ($${pizza2.toFixed(2)})</li>
            <li>Pizza 3 ($${pizza3.toFixed(2)})</li>
            <li>Papas ($${papas.toFixed(2)})</li>
            <li>Queso Extra ($${queso1.toFixed(2)})</li>
            <li>Refresco ($${refresco.toFixed(2)})</li>
            <li>Orilla Rellena ($${orilla.toFixed(2)})</li>
        </ul>
        <strong>Total:</strong> $${total.toFixed(2)}
    `;
    document.getElementById("detallePedido").dataset.total = total;
});

document.getElementById("continuarPago").addEventListener("click", function () {
    const metodoPago = document.querySelector('input[name="metodoPago"]:checked').value;
    const tipoServicio = document.querySelector('input[name="tipoServicio"]:checked').value;

    document.getElementById("detalle-seccion").classList.remove("activa");

    if (tipoServicio === "Entrega a domicilio") {
        document.getElementById("domicilio-seccion").classList.add("activa");
    } else {
        if (metodoPago === "Efectivo") {
            showEfectivoSection();
        } else if (metodoPago === "Tarjeta") {
            document.getElementById("tarjeta-seccion").classList.add("activa");
        }
    }
});

document.getElementById("continuarDomicilio").addEventListener("click", function () {
    document.getElementById("domicilio-seccion").classList.remove("activa");
    const metodoPago = document.querySelector('input[name="metodoPago"]:checked').value;

    if (metodoPago === "Efectivo") {
        showEfectivoSection();
    } else if (metodoPago === "Tarjeta") {
        document.getElementById("tarjeta-seccion").classList.add("activa");
    }
});

function showEfectivoSection() {
    const total = parseFloat(document.getElementById("detallePedido").dataset.total);
    const efectivoSection = document.getElementById("efectivo-seccion");

    efectivoSection.innerHTML = `
        <h1>Pago en Efectivo</h1>
        <p>Total a pagar: $${total.toFixed(2)}</p>
        <label for="billete">Ingrese con qué billete va a pagar:</label><br>
        <input type="number" id="billete" name="billete" required>
        <button type="button" id="calcularCambio">Calcular Cambio</button><br>
        <p id="cambio"></p>
        <button type="button" id="finalizarEfectivo">Finalizar Pedido</button>
        <button id="generarPDF">Generar PDF del Pedido</button>
    `;

    efectivoSection.classList.add("activa");

    document.getElementById("calcularCambio").addEventListener("click", function () {
        const billete = parseFloat(document.getElementById("billete").value);
        const cambio = billete - total;
        document.getElementById("cambio").textContent = cambio >= 0
            ? `Cambio: $${cambio.toFixed(2)}`
            : "El billete no cubre el monto total.";
    });

    document.getElementById("finalizarEfectivo").addEventListener("click", function () {
        alert("Gracias por tu pedido. El pago se realizará al momento de la entrega o consumo.");
    });

    document.getElementById("generarPDF").addEventListener("click", generarPDF);
}

document.getElementById("finalizarTarjeta").addEventListener("click", function () {
    alert("Pago con tarjeta realizado con éxito. ¡Gracias por tu pedido!");
});

document.getElementById("generarPDFEfectivo").addEventListener("click", generarPDF);

function generarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const nombre = document.getElementById("nombre").value;
    const fecha = document.getElementById("Fecha").value;
    const pizza1 = document.getElementById("Pizza1").options[document.getElementById("Pizza1").selectedIndex].text;
    const pizza2 = document.getElementById("Pizza2").options[document.getElementById("Pizza2").selectedIndex].text;
    const pizza3 = document.getElementById("Pizza3").options[document.getElementById("Pizza3").selectedIndex].text;
    const queso1 = document.getElementById("queso1").checked ? 20 : 0;
    const refresco = document.getElementById("refresco").checked ? 15 : 0;
    const orilla = document.getElementById("orilla").checked ? 34 : 0;
    const papas = document.getElementById("papas").checked ? 50 : 0;

    const total = parseFloat(pizza1.split('$')[1]) +
                  parseFloat(pizza2.split('$')[1]) +
                  parseFloat(pizza3.split('$')[1]) +
                  queso1 + refresco + orilla + papas;

    doc.text(`Nombre: ${nombre}`, 10, 20);
    doc.text(`Fecha: ${fecha}`, 10, 30);
    doc.text(`Productos:`, 10, 40);
    doc.text(`- ${pizza1}`, 10, 50);
    doc.text(`- ${pizza2}`, 10, 60);
    doc.text(`- ${pizza3}`, 10, 70);
    doc.text(`- Queso Extra: $${queso1}`, 10, 80);
    doc.text(`- Refresco: $${refresco}`, 10, 90);
    doc.text(`- Orilla Rellena: $${orilla}`, 10, 100);
    doc.text(`- Papas: $${papas}`, 10, 110);
    doc.text(`Total: $${total.toFixed(2)}`, 10, 120);

    doc.save('pedido_pizza.pdf');
}
