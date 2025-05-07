  function mostrarMedicamentos() {
    const seccionMedicamento = document.getElementById("seccion-medicamento");
    const contenidoInicial = document.querySelector(".contenido");
    const menu = document.querySelector(".menu-bar");
  
    // Oculta el contenido de inicio
    contenidoInicial.style.display = "none";
    menu.style.display = "none";
  
    // Muestra la sección de medicamentos
    seccionMedicamento.style.display = "block";
  }

const checkboxes = document.querySelectorAll('.producto');
const totalSpan = document.getElementById('total');

checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', actualizarTotal);
});

function actualizarTotal() {
  let total = 0;
  checkboxes.forEach(c => {
    if (c.checked) {
      total += parseFloat(c.value);
    }
  });
  totalSpan.textContent = total;
}

function comprar() {
  const total = totalSpan.textContent;
  alert("Total enviado: $" + total);
 
}
function confirmarCita() {
  alert('¡Tu cita está agendada exitosamente!');
}
function mostrarconsultas() {
  document.getElementById("seccion-medicamento").style.display = "none";
  document.querySelector(".contenido").style.display = "none";

  document.getElementById("seccion-consultas").style.display = "block";
}
function mostrarInicio() {
  document.getElementById("seccion-medicamento").style.display = "none";
  document.getElementById("seccion-consultas").style.display = "none";
  document.querySelector(".contenido").style.display = "block";
}
function naturista(){
  document.getElementById("seccion-medicamento").style.display = "none";
  document.querySelector(".contenido").style.display = "none";
  document.getElementById("seccion-consultas").style.display ="none";
  
  document.getElementById("seccion-naturista").style.display = "block";
}
function bebes(){
  document.getElementById("seccion-medicamento").style.display = "none";
  document.querySelector(".contenido").style.display = "none";
  document.getElementById("seccion-consultas").style.display ="none";
  document.getElementById("seccion-naturista").style.display = "none";

  document.getElementById("seccion-bebes").style.display = "block";
}

