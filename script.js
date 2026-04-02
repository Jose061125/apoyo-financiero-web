// Funciones de validación en tiempo real
function validarCampoRequerido(campo, mensajeError) {
  const valor = campo.value.trim();
  const errorDiv = campo.parentNode.querySelector('.error-message') || crearMensajeError(campo);

  if (!valor) {
    mostrarError(campo, errorDiv, mensajeError || 'Este campo es obligatorio.');
    return false;
  } else {
    ocultarError(campo, errorDiv);
    return true;
  }
}

function validarEmail(campo) {
  const valor = campo.value.trim();
  const errorDiv = campo.parentNode.querySelector('.error-message') || crearMensajeError(campo);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!valor) {
    mostrarError(campo, errorDiv, 'El email es obligatorio.');
    return false;
  } else if (!emailRegex.test(valor)) {
    mostrarError(campo, errorDiv, 'Ingresa un email válido.');
    return false;
  } else {
    ocultarError(campo, errorDiv);
    return true;
  }
}

function validarNumero(campo, min = 0) {
  const valor = Number(campo.value);
  const errorDiv = campo.parentNode.querySelector('.error-message') || crearMensajeError(campo);

  if (isNaN(valor) || valor <= min) {
    mostrarError(campo, errorDiv, `Ingresa un número mayor a ${min}.`);
    return false;
  } else {
    ocultarError(campo, errorDiv);
    return true;
  }
}

function crearMensajeError(campo) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  campo.parentNode.insertBefore(errorDiv, campo.nextSibling);
  return errorDiv;
}

function mostrarError(campo, errorDiv, mensaje) {
  campo.classList.add('error');
  campo.classList.remove('success');
  errorDiv.textContent = mensaje;
  errorDiv.style.display = 'block';
}

function ocultarError(campo, errorDiv) {
  campo.classList.remove('error');
  campo.classList.add('success');
  errorDiv.style.display = 'none';
}

// Contador animado de prueba social
function animarContadorRegistros(valorFinal, duracion = 1500) {
  const elemento = document.getElementById('contador-registros');
  if (!elemento) return;

  const inicio = 0;
  const paso = Math.ceil(valorFinal / (duracion / 30));
  let actual = inicio;

  const interval = setInterval(() => {
    actual += paso;
    if (actual >= valorFinal) {
      elemento.textContent = String(valorFinal);
      clearInterval(interval);
    } else {
      elemento.textContent = String(actual);
    }
  }, 30);
}

function mostrarCargando(elemento, mensaje = 'Enviando...') {
  elemento.classList.add('loading');
  elemento.textContent = mensaje;
  elemento.disabled = true;
}

function ocultarCargando(elemento, textoOriginal) {
  elemento.classList.remove('loading');
  elemento.textContent = textoOriginal;
  elemento.disabled = false;
}

// Aplicar validaciones en tiempo real
function agregarValidaciones(formulario) {
  const camposRequeridos = formulario.querySelectorAll('input[required], select[required], textarea[required]');
  const emails = formulario.querySelectorAll('input[type="email"]');
  const numeros = formulario.querySelectorAll('input[type="number"]');

  camposRequeridos.forEach(campo => {
    campo.addEventListener('blur', () => validarCampoRequerido(campo));
    campo.addEventListener('input', () => {
      if (campo.classList.contains('error')) {
        validarCampoRequerido(campo);
      }
    });
  });

  emails.forEach(campo => {
    campo.addEventListener('blur', () => validarEmail(campo));
    campo.addEventListener('input', () => {
      if (campo.classList.contains('error')) {
        validarEmail(campo);
      }
    });
  });

  numeros.forEach(campo => {
    campo.addEventListener('blur', () => validarNumero(campo));
    campo.addEventListener('input', () => {
      if (campo.classList.contains('error')) {
        validarNumero(campo);
      }
    });
  });
}

const formAhorro = document.getElementById('formulario-ahorro');
const resultado = document.getElementById('resultado');

// Contador animado prueba social
animarContadorRegistros(47);

// Agregar validaciones en tiempo real al formulario de ahorro
agregarValidaciones(formAhorro);

formAhorro.addEventListener('submit', function (event) {
  event.preventDefault();

  const metaCampo = document.getElementById('meta');
  const mesesCampo = document.getElementById('meses');

  const metaValida = validarNumero(metaCampo, 0);
  const mesesValida = validarNumero(mesesCampo, 0);

  if (!metaValida || !mesesValida) {
    resultado.textContent = 'Corrige los errores antes de calcular.';
    resultado.style.color = '#b81f1f';
    resultado.classList.add('show');
    return;
  }

  const meta = Number(metaCampo.value);
  const meses = Number(mesesCampo.value);
  const ahorroMensual = meta / meses;
  resultado.style.color = '#0f3e8f';
  resultado.textContent = `Debes ahorrar ${ahorroMensual.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })} al mes durante ${meses} meses para alcanzar ${meta.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}.`;
  resultado.classList.add('show');
});

// ------ Referencia y QR ------
function getQueryStringParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function actualizarMensajeReferencia() {
  const ref = getQueryStringParam('ref');
  const mensaje = document.getElementById('mensaje-referencia');
  if (!mensaje) return;

  if (ref) {
    localStorage.setItem('referralCode', ref);
    const totalReferidos = Number(localStorage.getItem('contadorReferidos') || '0') + 1;
    localStorage.setItem('contadorReferidos', String(totalReferidos));
    mensaje.textContent = `Has ingresado con la referencia de: ${ref}. ¡Gracias por confiar en tu amigo! (Referido #${totalReferidos})`;
  } else {
    const guardado = localStorage.getItem('referralCode');
    if (guardado) {
      mensaje.textContent = `Tu referencia activa es: ${guardado}. Comparte tu link con tus amigos.`;
    } else {
      mensaje.textContent = 'No se detectó referencia. Puedes generar tu propio QR abajo.';
    }
  }
}

function generarQR() {
  const codigo = document.getElementById('referencia-code').value.trim() || 'invitado';
  const url = `${window.location.origin}${window.location.pathname}?ref=${encodeURIComponent(codigo)}`;
  const qrImage = document.getElementById('qr-image');
  const qrLink = document.getElementById('qr-enlace');

  const qrcodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  qrImage.src = qrcodeUrl;
  qrImage.hidden = false;
  qrLink.textContent = url;
  qrLink.href = url;
  qrLink.hidden = false;
  qrLink.style.color = '#1d4f8b';
  qrLink.style.textDecoration = 'underline';
  qrLink.target = '_blank';
}

document.getElementById('btn-generar-qr').addEventListener('click', function (event) {
  event.preventDefault();
  generarQR();
});

document.addEventListener('DOMContentLoaded', function () {
  actualizarMensajeReferencia();
  renderProductos();
  if (localStorage.getItem('adminLogged') === 'true') {
    mostrarPanelAdmin();
  }
});

// Productos
const productosGrid = document.getElementById('productos-grid');

const productos = [
  {titulo: 'Mentoría financiera 1-a-1', descripcion: 'Sesiones semanales personalizadas para metas claras.', precio: 'COP 199,000', badge: 'Top'} ,
  {titulo: 'Plan “Libertad de Deudas”', descripcion: 'Estrategias prácticas para pagar deudas en 6 meses.', precio: 'COP 129,000', badge: 'Recomendado'},
  {titulo: 'Kit inversionista inicial', descripcion: 'Guías, herramientas y cálculos de retorno en 3 pasos.', precio: 'COP 179,000', badge: 'Nuevo'}
];

function renderProductos() {
  if (!productosGrid) return;
  productosGrid.innerHTML = productos.map(p => `
    <article class="producto-card">
      <h3>${p.titulo}</h3>
      <p>${p.descripcion}</p>
      <div class="precio">${p.precio}</div>
      <span class="badge">${p.badge}</span>
    </article>
  `).join('');
}

// Admin
const loginForm = document.getElementById('login-form');
const loginMsg = document.getElementById('login-msg');
const adminPanel = document.getElementById('adminPanel');
const adminStats = document.getElementById('admin-stats');
const logoutBtn = document.getElementById('logout-btn');

const adminCredenciales = { usuario: 'admin', password: 'finance2026' };

function mostrarPanelAdmin() {
  adminPanel.classList.remove('hidden');
  actualizarStatsAdmin();
}

function ocultarPanelAdmin() {
  adminPanel.classList.add('hidden');
}

function actualizarStatsAdmin() {
  const registros = JSON.parse(localStorage.getItem('registrosUsuarios') || '[]');
  const referidos = Number(localStorage.getItem('contadorReferidos') || 0);
  adminStats.innerHTML = `
    <ul>
      <li>Usuarios registrados: <strong>${registros.length}</strong></li>
      <li>Referidos totales: <strong>${referidos}</strong></li>
      <li>Ultimo usuario: <strong>${registros.length ? registros[registros.length-1].nombre : 'ninguno'}</strong></li>
    </ul>
  `;
}

loginForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const user = document.getElementById('login-user').value.trim();
  const pass = document.getElementById('login-pass').value.trim();

  if (user === adminCredenciales.usuario && pass === adminCredenciales.password) {
    localStorage.setItem('adminLogged', 'true');
    loginMsg.textContent = 'Sesión de administrador iniciada.';
    loginMsg.style.color = '#0f3e8f';
    mostrarPanelAdmin();
  } else {
    loginMsg.textContent = 'Usuario o contraseña incorrectos.';
    loginMsg.style.color = '#b81f1f';
  }
});

logoutBtn.addEventListener('click', function (event) {
  event.preventDefault();
  localStorage.removeItem('adminLogged');
  ocultarPanelAdmin();
  loginMsg.textContent = 'Sesion cerrada.';
  loginMsg.style.color = '#0f3e8f';
});

const formContacto = document.getElementById('formulario-contacto');
const msgContacto = document.getElementById('mensaje-envio');
const btnContacto = formContacto.querySelector('button[type="submit"]');

// Agregar validaciones en tiempo real al formulario de contacto
agregarValidaciones(formContacto);

formContacto.addEventListener('submit', function (event) {
  event.preventDefault();

  const nombreCampo = document.getElementById('nombre');
  const emailCampo = document.getElementById('email');
  const mensajeCampo = document.getElementById('mensaje');

  const nombreValido = validarCampoRequerido(nombreCampo, 'El nombre es obligatorio.');
  const emailValido = validarEmail(emailCampo);
  const mensajeValido = validarCampoRequerido(mensajeCampo, 'El mensaje es obligatorio.');

  if (!nombreValido || !emailValido || !mensajeValido) {
    msgContacto.textContent = 'Corrige los errores antes de enviar.';
    msgContacto.style.color = '#b81f1f';
    msgContacto.classList.add('show');
    return;
  }

  const nombre = nombreCampo.value.trim();
  const email = emailCampo.value.trim();
  const mensaje = mensajeCampo.value.trim();

  mostrarCargando(btnContacto, 'Enviando...');

  msgContacto.style.color = '#0f3e8f';
  msgContacto.textContent = `¡Gracias ${nombre}! Tu mensaje ha sido recibido. Te responderemos pronto a ${email}.`;
  msgContacto.classList.add('show');
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
    msgContacto.classList.add('show');
    ocultarCargando(btnContacto, 'Enviar mensaje');
  })
  .catch(() => {
    msgContacto.textContent = 'Ocurrió un error al enviar. Intenta de nuevo.';
    msgContacto.style.color = '#b81f1f';
    msgContacto.classList.add('show');
    ocultarCargando(btnContacto, 'Enviar mensaje');
  });
});

// Formulario de registro
const formRegistro = document.getElementById('formulario-registro');
const msgRegistro = document.getElementById('mensaje-registro');
const btnRegistro = formRegistro.querySelector('button[type="submit"]');

// Agregar validaciones en tiempo real al formulario de registro
agregarValidaciones(formRegistro);

formRegistro.addEventListener('submit', function (event) {
  event.preventDefault();

  const nombreCampo = document.getElementById('reg-nombre');
  const emailCampo = document.getElementById('reg-email');
  const objetivoCampo = document.getElementById('reg-objetivo');

  const nombreValido = validarCampoRequerido(nombreCampo, 'El nombre es obligatorio.');
  const emailValido = validarEmail(emailCampo);
  const objetivoValido = validarCampoRequerido(objetivoCampo, 'Selecciona un objetivo.');

  if (!nombreValido || !emailValido || !objetivoValido) {
    msgRegistro.textContent = 'Corrige los errores antes de registrarte.';
    msgRegistro.style.color = '#b81f1f';
    msgRegistro.classList.add('show');
    return;
  }

  const nombre = nombreCampo.value.trim();
  const email = emailCampo.value.trim();
  const telefono = document.getElementById('reg-telefono').value.trim();
  const objetivo = objetivoCampo.value;
  const newsletter = document.getElementById('reg-newsletter').checked;

  mostrarCargando(btnRegistro, 'Registrando...');

  msgRegistro.style.color = '#0f3e8f';
  msgRegistro.textContent = `¡Bienvenido ${nombre}! Te has registrado exitosamente. Recibirás información en ${email}.`;
  msgRegistro.classList.add('show');
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
    msgRegistro.classList.add('show');
    ocultarCargando(btnRegistro, 'Registrarme');
  })
  .catch(() => {
    msgRegistro.textContent = 'Registro guardado localmente. Hubo un error al enviar, pero puedes continuar.';
    msgRegistro.style.color = '#b81f1f';
    msgRegistro.classList.add('show');
    ocultarCargando(btnRegistro, 'Registrarme');
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

// Agregar validaciones en tiempo real al formulario de contratación
agregarValidaciones(formContratar);

formContratar.addEventListener('submit', function (event) {
  event.preventDefault();

  const nombreCampo = document.getElementById('cliente-nombre');
  const emailCampo = document.getElementById('cliente-email');
  const telefonoCampo = document.getElementById('cliente-telefono');
  const plan = planOculto.value;

  const nombreValido = validarCampoRequerido(nombreCampo, 'El nombre es obligatorio.');
  const emailValido = validarEmail(emailCampo);
  const telefonoValido = validarCampoRequerido(telefonoCampo, 'El teléfono es obligatorio.');

  if (!nombreValido || !emailValido || !telefonoValido || !plan) {
    confirmacionContrato.textContent = 'Corrige los errores antes de enviar la solicitud.';
    confirmacionContrato.style.color = '#b81f1f';
    confirmacionContrato.classList.add('show');
    return;
  }

  const clienteNombre = nombreCampo.value.trim();
  const clienteEmail = emailCampo.value.trim();
  const clienteTelefono = telefonoCampo.value.trim();

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
