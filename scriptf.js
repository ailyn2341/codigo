function mostrarMenu() {
  ocultarSecciones();
  document.getElementById("contenido-inicio").style.display = "block";
}


function ocultarSecciones() {
  const secciones = [
    "contenido-inicio", "seccion-medicamento", "seccion-naturista", 
    "seccion-bebes", "seccion-consulta", "seccion-promociones", "seccion-pago"
  ];
  secciones.forEach(id => {
    document.getElementById(id).style.display = "none";
  });
  ocultarFormulariosPago();
}


function mostrarMedicamentos() {
  ocultarSecciones();
  document.getElementById("seccion-medicamento").style.display = "block";
  actualizarTotal("seccion-medicamento");
}

function mostrarNaturista() {
  ocultarSecciones();
  document.getElementById("seccion-naturista").style.display = "block";
  actualizarTotal("seccion-naturista");
}

function mostrarBebes() {
  ocultarSecciones();
  document.getElementById("seccion-bebes").style.display = "block";
  actualizarTotal("seccion-bebes");
}

function mostrarConsultas() {
  ocultarSecciones();
  document.getElementById("seccion-consulta").style.display = "block";
}

function mostrarPromociones() {
  ocultarSecciones();
  document.getElementById("seccion-promociones").style.display = "block";
}


function actualizarTotal(idSeccion) {
  const seccion = document.getElementById(idSeccion);
  const checkboxes = seccion.querySelectorAll("input.producto");
  let total = 0;
  checkboxes.forEach(cb => {
    if (cb.checked) {
      total += Number(cb.dataset.precio);
    }
    
    cb.onchange = () => actualizarTotal(idSeccion);
  });

  let totalSpan;
  if (idSeccion === "seccion-medicamento") totalSpan = document.getElementById("total-medicamento");
  else if (idSeccion === "seccion-naturista") totalSpan = document.getElementById("total-naturista");
  else if (idSeccion === "seccion-bebes") totalSpan = document.getElementById("total-bebes");
  if (totalSpan) totalSpan.textContent = total.toFixed(2);
}

let productosSeleccionados = [];
let totalCompra = 0;
let seccionActual = null
document.getElementById("btnComprarMedicamento").addEventListener("click", () => {
  iniciarCompra("seccion-medicamento");
});
document.getElementById("btnComprarNaturista").addEventListener("click", () => {
  iniciarCompra("seccion-naturista");
});
document.getElementById("btnComprarBebes").addEventListener("click", () => {
  iniciarCompra("seccion-bebes");
});
function iniciarCompra(seccion) {
  seccionActual = seccion;

  const seccionEl = document.getElementById(seccion);
  const checkboxes = seccionEl.querySelectorAll("input.producto");
  productosSeleccionados = [];
  totalCompra = 0;
  checkboxes.forEach(cb => {
    if (cb.checked) {
      productosSeleccionados.push({
        nombre: cb.nextElementSibling ? cb.nextElementSibling.alt : "Producto",
        precio: Number(cb.dataset.precio)
      });
      totalCompra += Number(cb.dataset.precio);
    }
  });
  if (productosSeleccionados.length === 0) {
    alert("Selecciona al menos un producto para comprar.");
    return;
  }
  ocultarSecciones();
  mostrarSeccionPago();
}

function mostrarSeccionPago() {
  document.getElementById("seccion-pago").style.display = "block";
document.querySelectorAll('input[name="formaPago"]').forEach(radio => {
    radio.checked = false;
  });
  ocultarFormulariosPago();
}

function ocultarFormulariosPago() {
  document.getElementById("form-tarjeta").style.display = "none";
  document.getElementById("form-direccion").style.display = "none";
}

document.querySelectorAll('input[name="formaPago"]').forEach(radio => {
  radio.addEventListener("change", () => {
    if (radio.value === "tarjeta") {
      document.getElementById("form-tarjeta").style.display = "block";
      document.getElementById("form-direccion").style.display = "none";
    } else if (radio.value === "transferencia") {
      document.getElementById("form-tarjeta").style.display = "none";
      document.getElementById("form-direccion").style.display = "block";
    }
  });
});

function cancelarPago() {
  seccionActual = null;
  productosSeleccionados = [];
  totalCompra = 0;
  ocultarSecciones();
  mostrarMenu();
}

document.getElementById("btnPagarTarjeta").addEventListener("click", () => {
  const nombre = document.getElementById("nombreTitular");
  const numero = document.getElementById("numeroTarjeta");
  const cvv = document.getElementById("cvv");
  const fecha = document.getElementById("fechaVencimiento");

  if (!nombre.value.trim()) {
    alert("Ingresa el nombre del titular");
    nombre.focus();
    return;
  }
  if (!/^\d{16}$/.test(numero.value)) {
    alert("Ingresa un número de tarjeta válido (16 dígitos)");
    numero.focus();
    return;
  }
  if (!/^\d{3}$/.test(cvv.value)) {
    alert("Ingresa un CVV válido (3 dígitos)");
    cvv.focus();
    return;
  }
  if (!fecha.value) {
    alert("Selecciona la fecha de vencimiento");
    fecha.focus();
    return;
  }

  document.getElementById("form-tarjeta").style.display = "none";
  
  document.getElementById("form-direcciont").style.display = "block";
});


document.getElementById("btnEnviarDireccion").addEventListener("click", () => {
  const direccion = document.getElementById("direccion");
  const telefono = document.getElementById("telefono");
  
  if (!direccion.value.trim()) {
    alert("Ingresa la dirección");
    direccion.focus();
    return;
  }

  if (!/^\d{10}$/.test(telefono.value)) {
    alert("Ingresa un teléfono válido de 10 dígitos");
    telefono.focus();
    return;
  }
  generarPDFCompra(direccion.value, telefono.value);

  
  alert(" Por favor no olvides envíar tu captura a el siguiente correo ailynled10@gmail.com.");

  cancelarPago();
});

document.getElementById("btnEnviarDirecciont").addEventListener("click", () => {
  const direccion = document.querySelector("#form-direcciont input#direccion");
  const telefono = document.querySelector("#form-direcciont input#telefono");

  if (!direccion.value.trim()) {
    alert("Ingresa la dirección");
    direccion.focus();
    return;
  }

  if (!/^\d{10}$/.test(telefono.value)) {
    alert("Ingresa los 10 digitos");
    direccion.focus();
    return;
  }

  generarPDFCompra(direccion.value, telefono.value);
  alert("Gracias por tu compra, en menos de 24 horas llega tu pedido.");

  cancelarPago();
});



function generarPDFCompra(direccion, telefono) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Farmacia SOFI - Comprobante de Compra", 10, 20);
  doc.setFontSize(14);
  doc.text("Productos comprados:", 10, 35);

  let y = 45;
  productosSeleccionados.forEach((prod, i) => {
    doc.text(`${i + 1}. ${prod.nombre} - $${prod.precio.toFixed(2)}`, 15, y);
    y += 10;
  });

  doc.text(`Total: $${totalCompra.toFixed(2)}`, 10, y + 5);
  doc.text("Datos de envío:", 10, y + 20);
  doc.text(`Dirección: ${direccion}`, 15, y + 30);
  doc.text(`Teléfono: ${telefono}`, 15, y + 40);
  doc.setFontSize(16);
  doc.text("¡Gracias por tu compra!", 10, y + 60);

  doc.save("comprobante_compra.pdf");

  alert("Compra realizada con éxito. Se ha generado un PDF con el comprobante. Preséntalo el día de tu compra.");
}

  document.getElementById("btnGenerarPDFConsulta").addEventListener("click", () => {
    const fechaInput = document.getElementById("date");
    const horaInput = document.getElementById("time");

    if (!fechaInput.value) {
      alert("Por favor, selecciona una fecha.");
      fechaInput.focus();
      return;
    }

    if (!horaInput.value) {
      alert("Por favor, selecciona una hora.");
      horaInput.focus();
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const fecha = new Date(fechaInput.value);
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);

    doc.setFontSize(18);
    doc.text("Farmacia SOFI - Confirmación de Cita", 10, 20);
    doc.setFontSize(14);
    doc.text(`Tu cita está confirmada para el día ${fechaFormateada} a las ${horaInput.value}.`, 10, 40);
    doc.setFontSize(16);
    doc.text("Presenta este comprobante en ventanilla", 10, 50);
    doc.text("¡Gracias por preferirnos!", 10, 60);
    doc.save("confirmacion_cita.pdf");
  });

  
  function validarFormulario() {
    return true;
  }




function validarFormulario() {

   
  const nombre = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const fecha = document.getElementById("date").value;
  const hora = document.getElementById("time").value;


  if (nombre === "") {
    alert("Por favor, ingresa tu nombre.");
    return false;
  }

  if (apellido === "") {
    alert("Por favor, ingresa tu apellido.");
    return false;
  }

  const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!correoRegex.test(correo)) {
    alert("Ingresa un correo electrónico válido.");
    return false;
  }

  if (fecha === "") {
    alert("Por favor, selecciona una fecha.");
    return false;
  }

  if (hora === "") {
    alert("Por favor, selecciona una hora.");
    return false;
  }

  alert("Formulario válido. Puedes enviarlo.");
  
  return true;
}
