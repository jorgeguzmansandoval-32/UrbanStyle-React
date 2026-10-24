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

`npm run dev` inicia la API Express en `http://localhost:3001` y Vite en `http://localhost:5173` (o el siguiente puerto disponible). Para ejecutarlos por separado, abre dos terminales en esta carpeta:

```bash
# Terminal 1: API / backend
npm run dev:api
# Alternativa sin modo watch: node server/index.js

# Terminal 2: frontend
npm run dev:web
```

La configuración local se guarda en `.env` y queda excluida de Git. También se puede copiar `.env.example` y definir `ADMIN_EMAIL`, `ADMIN_PASSWORD` y `PORT` antes de iniciar. Si no existe una clave, el servidor genera una clave aleatoria y la guarda en `.env`; consulta ese archivo local para iniciar sesión.

### Credenciales de desarrollo

- Administrador: `admin@urbanstyle.cl` (o el valor de `ADMIN_EMAIL`). Configura una clave propia en `ADMIN_PASSWORD` dentro del `.env` local; si se deja vacía, se genera una clave aleatoria que queda guardada en ese archivo. No uses ni compartas credenciales locales en producción.
- Cliente de prueba: no se crea una cuenta con contraseña predeterminada. Registra una cuenta desde **Crear cuenta** con un correo de pruebas que controles y los datos de envío requeridos; después puedes volver a iniciar sesión con esa contraseña.
- Compra automatizada: `npm run test:e2e` crea una cuenta nueva con un correo `e2e-*@example.test` generado para cada ejecución y usa la contraseña de pruebas `UrbanStyleE2E!2026`. Cada ejecución deja su cliente y pedido de demostración en la base local; no procesa pagos.

## Producción local

```bash
npm run build
npm start
```

Express sirve la API y la aplicación compilada en `http://localhost:3001`.

## Pruebas

```bash
npm test
npm run verify:seeds
```

Karma ejecuta las pruebas en Chrome Headless; la suite cubre el catálogo, la búsqueda y filtros, la interfaz, las validaciones de acceso/registro/envío y las operaciones del carrito. `verify:seeds` comprueba que cada producto de SQLite tenga una imagen local válida.

Con la API local iniciada (`npm run dev` o `npm run dev:api`), ejecuta el flujo de compra API-a-SQLite:

```bash
npm run test:e2e
```

La prueba crea un correo de cliente único, cierra y vuelve a iniciar sesión, busca una prenda del catálogo y comprueba que el pedido pendiente de pago quedó persistido en SQLite. Genera registros de prueba en la base local; no procesa pagos.

## Persistencia y administración

- Catálogo, inventario, cuentas de cliente, sesiones y pedidos se guardan en `server/data/urbanstyle.db`.
- Las imágenes cargadas por el administrador se guardan en `server/uploads/`.
- Los productos de inicio se insertan en SQLite al arrancar por primera vez. Las prendas Streetwear de demostración también se agregan una sola vez a bases de datos existentes; sus precios y stock pueden editarse desde administración.
- Las imágenes iniciales se sirven desde `src/Imagen` a través de `/catalogo-images`; el catálogo y las fotos deben estar presentes en esa carpeta.
- El catálogo muestra las categorías **Polerones** y **Poleras**; el panel de administración permite seguir agregando prendas e imágenes autorizadas.
- El administrador inicia sesión desde la opción **Admin** del formulario de acceso. El servidor valida las credenciales y restringe las rutas de administración mediante una cookie `HttpOnly`.
- El dashboard muestra métricas reales del catálogo y los pedidos registrados. Los pedidos de demostración quedan en estado **Pendiente de pago**.
- El checkout guarda los datos de entrega y el resumen del pedido, pero no cobra ni inicia un envío. Para un despliegue público se debe integrar una pasarela de pago y revisar las medidas de seguridad y privacidad correspondientes.

La base de datos y los archivos subidos son datos locales ignorados por Git; realiza una copia de seguridad de `server/data/` y `server/uploads/` si necesitas conservarlos al mover el proyecto.
