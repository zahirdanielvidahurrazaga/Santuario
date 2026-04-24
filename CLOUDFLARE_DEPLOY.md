# Despliegue de Santuario en Cloudflare Pages

Tu sistema al usar "estados de React" (switch-view en lugar de React Router) es perfecto para un despliegue estático hiper-rápido en Cloudflare sin necesidad de reglas complejas de enrutamiento web.

Aquí tienes las 2 formas más fáciles de publicarlo hoy mismo. 

## Opción 1: Vía GitHub (La Más Profesional y Automática)
*Recomendado porque cada vez que hagas un cambio, se actualizará solo en la web.*

1. Entra a tu panel de **Cloudflare**.
2. Ve al menú lateral: **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
3. Selecciona tu repositorio de GitHub de `Santuario` (o créalo si no lo has subido).
4. Configura el **Build**:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Haz clic en **Save and Deploy**.

*(En menos de 2 minutos estará activo, y gratis).*

---

## Opción 2: Vía Terminal Local (Modo Rápido)
Si no quieres usar GitHub y mandar los archivos directamente desde tu computadora a Cloudflare:

1. Abre la terminal en esta carpeta y construye tu proyecto:
   ```bash
   npm run build
   ```
2. Instala la herramienta de Cloudflare y despliega directamente ejecutando:
   ```bash
   npx wrangler pages deploy dist
   ```
*(El archivo `wrangler.toml` ya está configurado en tu directorio para reconocer el nombre del proyecto `santuario-frontend`).*

> [!NOTE]
> ¡Eso es todo! Con esto Santuario estará en vivo mundialmente para tu presentación presencial. Cuando integremos **Supabase** más adelante, la arquitectura frontend no necesitará reconstruirse, simplemente inyectaremos las variables de entorno de la base de datos dentro del panel de Cloudflare.
