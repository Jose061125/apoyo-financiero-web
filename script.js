const formAhorro = document.getElementById('formulario-ahorro');
const resultado = document.getElementById('resultado');

formAhorro.addEventListener('submit', function (event) {
  event.preventDefault();

  const meta = Number(document.getElementById('meta').value);
  const meses = Number(document.getElementById('meses').value);

  if (!meta || !meses || meta <= 0 || meses <= 0) {
    resultado.textContent = 'Ingresa valores válidos para meta y plazo.';
    resultado.style.color = '#b81f1f';
    return;
  }

  const ahorroMensual = meta / meses;
  resultado.style.color = '#0f3e8f';
  resultado.textContent = `Debes ahorrar ${ahorroMensual.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })} al mes durante ${meses} meses para alcanzar ${meta.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}.`;
});

const formContacto = document.getElementById('formulario-contacto');
const msgContacto = document.getElementById('mensaje-envio');

formContacto.addEventListener('submit', function (event) {
  event.preventDefault();
  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();

  if (!nombre || !email || !mensaje) {
    msgContacto.textContent = 'Completa todos los campos antes de enviar.';
    msgContacto.style.color = '#b81f1f';
    return;
  }

  msgContacto.style.color = '#0f3e8f';
  msgContacto.textContent = `¡Gracias ${nombre}! Tu mensaje ha sido recibido. Te responderemos pronto a ${email}.`;
  formContacto.reset();

  // Enviar datos a Formspree (reemplazar 'YOUR_FORM_ID' por tu ID real)
  fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: nombre,
      email: email,
      message: mensaje
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al enviar el formulario');
    }
    return response.json();
  })
  .then(() => {
    msgContacto.textContent = 'Mensaje enviado correctamente. Gracias por escribirnos.';
  })
  .catch(() => {
    msgContacto.textContent = 'Ocurrió un error al enviar. Intenta de nuevo.';
    msgContacto.style.color = '#b81f1f';
  });
});

// Formulario de registro
const formRegistro = document.getElementById('formulario-registro');
const msgRegistro = document.getElementById('mensaje-registro');

formRegistro.addEventListener('submit', function (event) {
  event.preventDefault();
  const nombre = document.getElementById('reg-nombre').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const telefono = document.getElementById('reg-telefono').value.trim();
  const objetivo = document.getElementById('reg-objetivo').value;
  const newsletter = document.getElementById('reg-newsletter').checked;

  if (!nombre || !email || !objetivo) {
    msgRegistro.textContent = 'Completa los campos obligatorios antes de registrarte.';
    msgRegistro.style.color = '#b81f1f';
    return;
  }

  msgRegistro.style.color = '#0f3e8f';
  msgRegistro.textContent = `¡Bienvenido ${nombre}! Te has registrado exitosamente. Recibirás información en ${email}.`;
  formRegistro.reset();

  // Almacenar registro en localStorage
  const registro = {
    nombre: nombre,
    email: email,
    telefono: telefono,
    objetivo: objetivo,
    newsletter: newsletter,
    fecha: new Date().toISOString()
  };

  const stored = JSON.parse(localStorage.getItem('registrosUsuarios') || '[]');
  stored.push(registro);
  localStorage.setItem('registrosUsuarios', JSON.stringify(stored));

  // Enviar datos a Formspree (reemplazar 'YOUR_FORM_ID' por tu ID real)
  fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nombre: nombre,
      email: email,
      telefono: telefono,
      objetivo: objetivo,
      newsletter: newsletter ? 'Sí' : 'No',
      tipo: 'Registro de usuario'
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al enviar el registro');
    }
    return response.json();
  })
  .then(() => {
    msgRegistro.textContent = 'Registro enviado correctamente. ¡Bienvenido a la comunidad!';
  })
  .catch(() => {
    msgRegistro.textContent = 'Registro guardado localmente. Hubo un error al enviar, pero puedes continuar.';
    msgRegistro.style.color = '#b81f1f';
  });
});

// Modal de contratación de planes
const modal = document.getElementById('modal');
const planSeleccionado = document.getElementById('plan-seleccionado');
const planOculto = document.getElementById('plan-oculto');
const closeModalBtn = document.getElementById('close-modal');
const contratarBtns = document.querySelectorAll('.contratar-btn');
const formContratar = document.getElementById('formulario-contratar');
const confirmacionContrato = document.getElementById('confirmacion-contrato');

function abrirModal(plan) {
  planSeleccionado.innerHTML = `Plan seleccionado: <strong>${plan}</strong>`;
  planOculto.value = plan;
  confirmacionContrato.textContent = '';
  confirmacionContrato.classList.remove('show');
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function cerrarModal() {
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  formContratar.reset();
}

contratarBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    abrirModal(btn.dataset.plan);
  });
});

closeModalBtn.addEventListener('click', cerrarModal);
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    cerrarModal();
  }
});

formContratar.addEventListener('submit', function (event) {
  event.preventDefault();

  const clienteNombre = document.getElementById('cliente-nombre').value.trim();
  const clienteEmail = document.getElementById('cliente-email').value.trim();
  const clienteTelefono = document.getElementById('cliente-telefono').value.trim();
  const plan = planOculto.value;

  if (!clienteNombre || !clienteEmail || !clienteTelefono || !plan) {
    confirmacionContrato.textContent = 'Por favor completa todos los datos para procesar la solicitud.';
    confirmacionContrato.style.color = '#b81f1f';
    confirmacionContrato.classList.add('show');
    return;
  }

  confirmacionContrato.textContent = `¡Solicitud enviada! Nos pondremos en contacto (plan: ${plan}).`;
  confirmacionContrato.style.color = '#0f3e8f';
  confirmacionContrato.classList.add('show');

  const solicitud = {
    nombre: clienteNombre,
    email: clienteEmail,
    telefono: clienteTelefono,
    plan: plan,
    notas: document.getElementById('cliente-notas').value.trim(),
    fecha: new Date().toISOString()
  };

  const stored = JSON.parse(localStorage.getItem('solicitudesContratacion') || '[]');
  stored.push(solicitud);
  localStorage.setItem('solicitudesContratacion', JSON.stringify(stored));

  formContratar.reset();
  setTimeout(cerrarModal, 2000);
});

function mostrarSolicitudesGuardadas() {
  const storage = JSON.parse(localStorage.getItem('solicitudesContratacion') || '[]');
  if (!storage.length) return;
  console.log('Solicitudes de contratación guardadas:', storage);
}

mostrarSolicitudesGuardadas();
