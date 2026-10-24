# UrbanStyle

Tienda de demostración construida con React, Vite, Express y SQLite.

## Requisitos

- Node.js 20 o superior
- npm

## Desarrollo

Desde esta carpeta (`UrbanStyle-React`):

```bash
npm install
npm run dev
```

El comando inicia la API Express en `http://localhost:3001` y Vite en `http://localhost:5173` (o el siguiente puerto disponible). La terminal muestra la clave del administrador cuando se crea por primera vez.

La configuración local se guarda en `.env` y queda excluida de Git. También se puede copiar `.env.example` y definir `ADMIN_EMAIL`, `ADMIN_PASSWORD` y `PORT` antes de iniciar. Si no existe una clave, el servidor genera una clave aleatoria, la guarda en `.env` y la muestra una sola vez en la terminal.

## Producción local

```bash
npm run build
npm start
```

Express sirve la API y la aplicación compilada en `http://localhost:3001`.

## Persistencia y administración

- Catálogo, inventario, cuentas de cliente, sesiones y pedidos se guardan en `server/data/urbanstyle.db`.
- Las imágenes cargadas por el administrador se guardan en `server/uploads/`.
- Los productos de inicio se insertan en SQLite al arrancar por primera vez. Las prendas Streetwear de demostración también se agregan una sola vez a bases de datos existentes; sus precios y stock pueden editarse desde administración.
- El catálogo muestra las categorías **Polerones** y **Poleras**; el panel de administración permite seguir agregando prendas e imágenes autorizadas.
- El administrador inicia sesión desde la opción **Admin** del formulario de acceso. El servidor valida las credenciales y restringe las rutas de administración mediante una cookie `HttpOnly`.
- El dashboard muestra métricas reales del catálogo y los pedidos registrados. Los pedidos de demostración quedan en estado **Pendiente de pago**.
- El checkout guarda los datos de entrega y el resumen del pedido, pero no cobra ni inicia un envío. Para un despliegue público se debe integrar una pasarela de pago y revisar las medidas de seguridad y privacidad correspondientes.

La base de datos y los archivos subidos son datos locales ignorados por Git; realiza una copia de seguridad de `server/data/` y `server/uploads/` si necesitas conservarlos al mover el proyecto.
