# 🔐 Guía de Configuración: Admin Panel Authentication

## Problema Actual
El panel de administración no acepta la contraseña en producción (Vercel), aunque funciona localmente.

## Causa
La variable de entorno `ADMIN_PASSWORD` no está configurada correctamente en Vercel o no está disponible para las Server Actions.

---

## ✅ Solución: Configurar Variables de Entorno en Vercel

### Paso 1: Acceder al Dashboard de Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión en tu cuenta
3. Selecciona tu proyecto: **retro-archive**

### Paso 2: Configurar Variables de Entorno

1. Haz clic en **Settings** (Configuración) en el menú superior
2. En el menú lateral, selecciona **Environment Variables**
3. Agrega las siguientes variables:

#### Variable 1: ADMIN_PASSWORD
```
Nombre: ADMIN_PASSWORD
Valor: [tu-contraseña-segura]
Entorno: Production, Preview, Development (marcar los 3)
```

#### Variable 2: GITHUB_TOKEN (si no existe)
```
Nombre: GITHUB_TOKEN
Valor: [tu-github-personal-access-token]
Entorno: Production, Preview, Development (marcar los 3)
```

### Paso 3: Crear GitHub Token (si no lo tienes)

1. Ve a [GitHub Settings > Developer Settings > Personal Access Tokens](https://github.com/settings/tokens)
2. Click en **"Generate new token (classic)"**
3. Dale un nombre descriptivo: "Retro Archive Admin"
4. Selecciona los siguientes permisos:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
5. Click en **"Generate token"**
6. **COPIA EL TOKEN INMEDIATAMENTE** (no podrás verlo de nuevo)
7. Pégalo en la variable `GITHUB_TOKEN` en Vercel

### Paso 4: Guardar y Desplegar

1. Haz clic en **"Save"** después de agregar cada variable
2. Vercel te preguntará si quieres crear un nuevo despliegue
3. Click en **"Redeploy"** o **"Deploy Now"**

### Paso 5: Verificar

Espera 2-3 minutos a que el despliegue termine, luego:

1. Ve a tu sitio en producción: `https://tu-dominio.vercel.app/admin/login`
2. Intenta ingresar con la contraseña que configuraste en `ADMIN_PASSWORD`
3. Deberías poder acceder correctamente

---

## 🔍 Debug en Desarrollo Local

Para probar localmente, crea un archivo `.env.local` en la raíz del proyecto:

```env
# .env.local
ADMIN_PASSWORD=tu_password_aqui
GITHUB_TOKEN=ghp_tu_token_aqui
```

**IMPORTANTE:** Este archivo NO debe subirse a GitHub (ya está en `.gitignore`)

---

## ⚠️ Errores Comunes

### Error: "CONFIGURATION ERROR: ADMIN_PASSWORD not set"
**Solución:** La variable no está configurada en Vercel. Repite el Paso 2.

### Error: "ACCESS DENIED: Invalid credentials"
**Solución:** La contraseña que estás ingresando no coincide con `ADMIN_PASSWORD` en Vercel.

### Error: "Missing GITHUB_TOKEN"
**Solución:** El token de GitHub no está configurado. Repite el Paso 3.

### Error: "GitHub API rejected write request"
**Solución:** El token de GitHub no tiene los permisos correctos. Ve al Paso 3 y asegúrate de seleccionar el permiso `repo`.

---

## 🎯 Valores Recomendados

- **ADMIN_PASSWORD:** Mínimo 12 caracteres, combinación de letras, números y símbolos
- **GITHUB_TOKEN:** Token "classic" con permisos `repo` y `workflow`

---

## 📝 Notas Adicionales

1. **Después de cambiar variables:** Siempre haz un nuevo deploy para que los cambios tengan efecto
2. **No compartas tu contraseña:** Nunca subas `.env.local` a GitHub
3. **Rota el token:** Cambia tu GitHub token cada 6 meses por seguridad
4. **Rate Limiting:** Si ves errores de "Too many attempts", espera 15 minutos antes de reintentar

---

## 🚀 Próximos Pasos

Una vez que hayas configurado correctamente las variables:

1. Accede al admin panel: `/admin`
2. Ve a **TRANSFORMATIONS** para gestionar las comparaciones Anime to Real
3. Sube nuevas transformaciones con las imágenes anime y cosplay
4. Los cambios se verán reflejados en `/[lang]/anime-to-real`

---

✅ **Configuración completada con éxito cuando puedas:**
- Acceder a `/admin/login`
- Ingresar tu contraseña
- Ver el Dashboard del Admin
- Crear/editar productos y transformaciones
