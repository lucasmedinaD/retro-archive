# 🔐 Configuración de Seguridad - Admin Panel

## Paso a Paso para Configurar

### 1. Ir a Vercel Dashboard
```
https://vercel.com/[tu-usuario]/retro-archive
```

### 2. Navegar a Settings → Environment Variables

### 3. Agregar Variables (ambas son REQUERIDAS):

#### Variable 1: ADMIN_PASSWORD
```
Key:   ADMIN_PASSWORD
Value: [Tu password seguro aquí]
Environments: ✅ Production ✅ Preview ✅ Development
```

**Ejemplo de password seguro**:
- `RetroArchive2024!Secure`
- `MyS3cur3P@ssw0rd!`
- `Goj0_2024_Admin!`

#### Variable 2: GITHUB_TOKEN
```
Key:   GITHUB_TOKEN  
Value: [Tu GitHub Personal Access Token]
Environments: ✅ Production ✅ Preview ✅ Development
```

**Cómo obtener GitHub Token**:
1. Ve a https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Permisos necesarios:
   - ✅ `repo` (Full control of private repositories)
4. Copia el token (solo se muestra una vez)

### 4. Redeploy

Después de agregar las variables:
1. Ve a "Deployments"
2. Click "..." en el deployment más reciente
3. Click "Redeploy"

---

## ✅ Verificar que Funciona

1. **Sin password configurado**:
   - Ir a `/admin/login`
   - Intentar entrar con cualquier password
   - Debería decir: "CONFIGURATION ERROR: ADMIN_PASSWORD not set"

2. **Con password configurado**:
   - Ir a `/admin/login`
   - Entrar con tu password de Vercel
   - Debería permitir acceso ✅

3. **Settings guardando**:
   - Ir a `/admin/settings`
   - Cambiar URLs de redes sociales
   - Click "GUARDAR CAMBIOS"
   - Debería decir "✓ Guardado exitosamente"

---

## 🛡️ Seguridad Implementada

- ✅ Password solo de variable de entorno (no hardcoded)
- ✅ Rate limiting (5 intentos → lock 15 min)
- ✅ Cookies HTTP-only
- ✅ Session expira en 24h
- ✅ Settings se guardan en GitHub (persistente)

---

## ⚠️ Problemas Comunes

**"Error al guardar" en Settings**:
- Causa: GITHUB_TOKEN no configurado
- Solución: Agregar en Vercel env vars

**Login dice "CONFIGURATION ERROR"**:
- Causa: ADMIN_PASSWORD no configurado en Vercel
- Solución: Agregar en Vercel env vars y redeploy

**Password correcto pero no entra**:
- Causa: Env var no sincronizada
- Solución: Redeploy después de agregar la variable

---

## 📝 Local Development

Para desarrollo local, crea `.env.local`:

```env
ADMIN_PASSWORD=tu_password_dev
GITHUB_TOKEN=ghp_tu_token_aqui
```

**⚠️ NUNCA** subas `.env.local` a Git (ya está en `.gitignore`)
