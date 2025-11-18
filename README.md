# Club Deportivo Patagonia Sur - Plantilla full-stack

Plantilla web full-stack pensada para clubes deportivos barriales de Argentina. Incluye frontend mobile-first, backend Express + SQLite y flujo de pagos simulados listo para reemplazar por Mercado Pago.

## Requisitos
- Node.js 18+
- npm

## Instalación
```bash
npm install
```

## Variables de entorno
1. Duplicá `.env.example` y renombrá a `.env`.
2. Ajustá los valores:
   - `PORT`: puerto del servidor.
   - `DATABASE_FILE`: nombre del archivo SQLite.
   - `WHATSAPP_NUMBER`: número sin `+` para los accesos directos.
   - `MERCADOPAGO_ACCESS_TOKEN`: token de prueba o real.
   - `FRONTEND_URL`: URL pública del sitio.

## Correr el proyecto
### Desarrollo
```bash
npm run dev
```

### Producción simple
```bash
npm start
```

El sitio quedará disponible en `http://localhost:3000`.

## Estructura principal
```
backend/
  app.js
  db.js
  models/
  routes/
  middleware/
frontend/public/
  index.html
  styles.css
  script.js
  assets/
```

## Personalización rápida
- **Nombre y textos del club:** editar `frontend/public/index.html`.
- **Colores:** cambiar variables CSS en `frontend/public/styles.css` (`:root`).
- **Número de WhatsApp:** actualizar enlaces en `index.html` y constante `WHATSAPP_NUMBER` en `script.js`.
- **Productos de la tienda:** modificar la tabla `products` en `backend/db.js` o cargar desde la base de datos.

## Formularios incluidos
- Inscripción a escuela de fútbol (`/api/enrollments`).
- Reserva de cancha (`/api/bookings`).
- Contacto general (`/api/contact`).
- Tienda con pedidos y pagos (`/api/store`).

Los datos se almacenan en SQLite (`DATABASE_FILE`).

## Pagos y Mercado Pago
La ruta `POST /api/store/payments/create-preference` crea una preferencia usando el SDK oficial cuando existe `MERCADOPAGO_ACCESS_TOKEN`. Si no hay token, responde con un flujo simulado (`pago-simulado.html`).

Para usar Mercado Pago en producción:
1. Creá credenciales de producción.
2. Agregá tus URLs reales en `back_urls` (archivo `backend/routes/store.js`).
3. Manejá notificaciones IPN/Webhooks para actualizar el estado de los pedidos en `orders`.

## Próximos pasos sugeridos
- Panel de administración para confirmar reservas y pagos.
- Integración con calendario Google/Microsoft (ver comentario en sección canchas).
- Autenticación para staff del club.

## Licencia
MIT. Podés usarla para tus clientes adaptando colores, logos e información.