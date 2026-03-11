# Pre-Commit Code Quality Validation

Este proyecto incluye validaciones automáticas en el pre-commit hook para garantizar la calidad del código.

## ¿Qué se valida?

### Backend (Python)

- ✅ **Syntax Check**: Errores de sintaxis Python
- ✅ **Import Organization**: Orden correcto de imports con `isort`
- ✅ **Code Formatting**: Formato con `black`
- ✅ **Unused Variables**: Detección de variables sin usar
- ✅ **Unused Imports**: Detección de imports sin usar
- ✅ **Type Checking**: Validación de tipos con `mypy`
- ✅ **Code Analysis**: Análisis comprehensive con `pylint`

### Frontend (TypeScript/React)

- ✅ **ESLint**: Validación y auto-fix de errores de linting
- ✅ **Type Checking**: Validación de tipos TypeScript

## Instalación

### 1. Instalar dependencias de Python

```bash
cd apps/backend
pip install -r ../../requirements.txt
```

O instalar solo las herramientas de validación:

```bash
pip install pylint black isort mypy flake8
```

### 2. Instalar dependencias de Node.js

```bash
pnpm install
```

### 3. Configurar Husky

```bash
pnpm prepare
```

## Uso

El pre-commit se ejecuta automáticamente cuando intentas hacer commit:

```bash
git commit -m "tu mensaje"
```

### Validaciones automáticas

1. **Formateo**: El código se auto-formatea con `prettier` y `black`
2. **Backend**: Se validan Python, imports y tipos
3. **Frontend**: Se valida TypeScript y ESLint

Si alguna validación falla, el commit se bloquea.

## Scripts disponibles

```bash
# Validar todo manualmente
bash scripts/validate-all.sh

# Validar solo backend
bash scripts/validate-backend.sh

# Validar solo frontend
bash scripts/validate-frontend.sh

# Formatear código
pnpm run commit:format
```

## Configuración

### Backend

- **`.pylintrc`**: Configuración de pylint
- **`mypy.ini`**: Configuración de mypy
- **`setup.cfg`**: Configuración de isort

### Frontend

- **`.eslintignore`** y **`.eslintrc`**: Configuración en `apps/frontend`

## Forzar commit sin validación

⚠️ **No recomendado**, pero si necesitas:

```bash
git commit --no-verify -m "mensaje"
```

## Solución de problemas

### "command not found: isort/black/pylint"

Instala las herramientas manualmente:

```bash
pip install isort black pylint mypy flake8
```

### "ESLint not configured"

Asegúrate de que el frontend tiene su configuración:

```bash
cd apps/frontend
npm install
```

### Los cambios se revierten después del commit

Algunos archivos pueden revertirse si fueron auto-formateados. Es seguro hacer commit nuevamente.

## Qué hace cada herramienta

| Herramienta  | Propósito                              | Bloquea Commit   |
| ------------ | -------------------------------------- | ---------------- |
| **pylint**   | Análisis estático, unused vars/imports | ✅ Sí (crítico)  |
| **black**    | Formatea automáticamente               | ❌ No (auto-fix) |
| **isort**    | Ordena imports automáticamente         | ❌ No (auto-fix) |
| **mypy**     | Validación de tipos                    | ⚠️ Advertencia   |
| **eslint**   | Validación JS/TS                       | ✅ Sí            |
| **prettier** | Formatea automáticamente               | ❌ No (auto-fix) |

## Mantenimiento

Para actualizar herramientas:

```bash
# Backend
pip install --upgrade pylint black isort mypy flake8

# Frontend
pnpm install
```
