document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.menu');
  const btnHamburguesa = document.querySelector('.btn-hamburguesa');
  const yearSpan = document.getElementById('anio');
  const productosContainer = document.getElementById('productos');
  const carritoLista = document.getElementById('lista-carrito');
  const totalCarrito = document.getElementById('total-carrito');
  const mensajeCarrito = document.querySelector('.mensaje-carrito');
  const btnComprar = document.getElementById('btn-comprar');
  const emailCompra = document.getElementById('email-compra');
  const forms = document.querySelectorAll('form');

  const API_BASE = '/api';
  const WHATSAPP_NUMBER = '5492995550000'; // Cambiar aquí para adaptar a otro club
  let carrito = [];

  yearSpan.textContent = new Date().getFullYear();

  btnHamburguesa.addEventListener('click', () => {
    menu.classList.toggle('activo');
  });

  document.querySelectorAll('a[href^="#"]').forEach((enlace) => {
    enlace.addEventListener('click', (e) => {
      const destino = document.querySelector(enlace.getAttribute('href'));
      if (destino) {
        e.preventDefault();
        destino.scrollIntoView({ behavior: 'smooth' });
        menu.classList.remove('activo');
      }
    });
  });

  const whatsappAcciones = {
    'whatsapp-general': 'Hola, me gustaría hacer una consulta sobre el club.',
    'whatsapp-escuela': 'Hola, quiero info sobre la escuela de fútbol para mi hijo/a.',
    'whatsapp-canchas': 'Hola, quiero consultar por una reserva de cancha el [FECHA/HORA].'
  };

  document.querySelectorAll('[data-accion^="whatsapp"]').forEach((boton) => {
    boton.addEventListener('click', () => {
      const mensaje = whatsappAcciones[boton.dataset.accion] || 'Hola, necesito más info.';
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
      window.open(url, '_blank');
    });
  });

  forms.forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const mensaje = form.querySelector('.mensaje-form');
      mensaje.textContent = 'Enviando...';
      const formData = Object.fromEntries(new FormData(form));
      let endpoint = '';

      if (form.id === 'form-inscripcion') endpoint = `${API_BASE}/enrollments`;
      if (form.id === 'form-reserva') endpoint = `${API_BASE}/bookings`;
      if (form.id === 'form-contacto') endpoint = `${API_BASE}/contact`;

      try {
        const respuesta = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await respuesta.json();
        if (!respuesta.ok) throw new Error(data.message || 'Error');
        mensaje.textContent = data.message;
        form.reset();
      } catch (error) {
        mensaje.textContent = error.message || 'No pudimos enviar el formulario.';
      }
    });
  });

  const renderProductos = (productos) => {
    productosContainer.innerHTML = '';
    productos.forEach((producto) => {
      const card = document.createElement('article');
      card.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <p><strong>$${producto.precio.toLocaleString('es-AR')}</strong></p>
        <label>Talle
          <select data-select-talle>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>
        </label>
        <button class="btn secundario" data-id="${producto.id}" data-precio="${producto.precio}" data-nombre="${producto.nombre}">Agregar al carrito</button>
      `;
      productosContainer.appendChild(card);
    });
  };

  const actualizarCarrito = () => {
    carritoLista.innerHTML = '';
    let total = 0;
    carrito.forEach((item, index) => {
      total += item.precio * item.cantidad;
      const li = document.createElement('li');
      li.textContent = `${item.nombre} (${item.talle}) x${item.cantidad} - $${item.precio.toLocaleString('es-AR')}`;
      const btnEliminar = document.createElement('button');
      btnEliminar.textContent = '✕';
      btnEliminar.setAttribute('aria-label', 'Eliminar producto');
      btnEliminar.addEventListener('click', () => {
        carrito.splice(index, 1);
        actualizarCarrito();
      });
      li.appendChild(btnEliminar);
      carritoLista.appendChild(li);
    });
    totalCarrito.textContent = `$${total.toLocaleString('es-AR')}`;
  };

  productosContainer.addEventListener('click', (event) => {
    if (event.target.matches('button[data-id]')) {
      const card = event.target.closest('article');
      const talle = card.querySelector('select').value;
      const id = Number(event.target.dataset.id);
      const nombre = event.target.dataset.nombre;
      const precio = Number(event.target.dataset.precio);
      const existente = carrito.find((item) => item.id === id && item.talle === talle);
      if (existente) {
        existente.cantidad += 1;
      } else {
        carrito.push({ id, nombre, precio, cantidad: 1, talle });
      }
      actualizarCarrito();
    }
  });

  btnComprar.addEventListener('click', async () => {
    if (!carrito.length) {
      mensajeCarrito.textContent = 'Agregá productos al carrito.';
      return;
    }
    if (!emailCompra.value) {
      mensajeCarrito.textContent = 'Ingresá un email para enviarte el comprobante.';
      return;
    }
    mensajeCarrito.textContent = 'Creando pedido...';
    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    try {
      const orderResponse = await fetch(`${API_BASE}/store/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productos: carrito, total, emailCliente: emailCompra.value })
      });
      const orderData = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(orderData.message);

      const preferenceResponse = await fetch(`${API_BASE}/store/payments/create-preference`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productos: carrito, total })
      });
      const preferenceData = await preferenceResponse.json();
      if (!preferenceResponse.ok) throw new Error(preferenceData.message);

      const link = preferenceData.init_point || preferenceData.sandbox_init_point;
      window.open(link, '_blank');
      mensajeCarrito.textContent = 'Redirigiendo a la pasarela de pago...';
    } catch (error) {
      mensajeCarrito.textContent = error.message || 'No pudimos iniciar el pago.';
    }
  });

  const cargarProductos = async () => {
    try {
      const res = await fetch(`${API_BASE}/store/products`);
      const data = await res.json();
      renderProductos(data);
    } catch (error) {
      productosContainer.innerHTML = '<p>No pudimos cargar los productos.</p>';
    }
  };

  cargarProductos();
});