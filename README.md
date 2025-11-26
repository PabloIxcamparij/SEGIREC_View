# Sistema de Envío de Mensajes Multiplataforma

![React](https://img.shields.io/badge/React-18.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Vite](https://img.shields.io/badge/Vite-5.x-purple)
![Docker](https://img.shields.io/badge/Docker-Enabled-green)
![Tailwind CSS]([https://img.shields.io/badge/tailwind_css-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white](https://img.shields.io/badge/Tailwind_CSS-4.1.12-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white))

## Tabla de Contenidos
- [Descripción](#descripción)
- [Características](#características)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Desarrollo](#desarrollo)

## Descripción

Sistema web completo para la gestión y envío masivo de mensajes a través de correo electrónico y WhatsApp. Incluye panel de administración, control de usuarios, registro de actividades y generación de reportes.

## Características

### Medidas de Seguridad Implementadas
- **JWT en cookies** para autenticación
- **Validación de esquemas** con Valibot
- **Headers de seguridad** en Nginx
- **CSP (Content Security Policy)**
- **Roles y permisos** granulares
- **Eliminación lógica** de usuarios
- **Límites de tiempo** para códigos de autorización

### Autenticación y Seguridad
- **Sistema de Login** con JWT mediante cookies
- Acceso restringido - solo administradores pueden crear usuarios
- Gestión de sesiones seguras

### Módulo de Envío de Mensajes
- **Envío de Propiedades**: Formulario con filtros avanzados
- **Envío de Morosidad**: Formulario con filtros avanzados
- **Envío Masivo**: Carga de archivos Excel (.xlsx)

- ### Flujo de Envío de Mensajes
1. **Seleccionar tipo de envío** (Propiedades, Morosidad o Masivo)
2. **Configurar filtros** o cargar archivo Excel
3. **Consultar** para obtener lista de destinatarios
4. **Seleccionar método de envío**:
   - Correo electrónico (default) Se puede enviar una cantidad de 250 mensajes como máximo
   - WhatsApp (switch activable)
   - Envío prioritario (requiere autorización)
5. **Proceso de autorización** (si aplica):
   - Solicitar código de 6 dígitos
   - Ingresar código recibido
   - Confirmar envío

- **Mecanismo de Seguridad**:
  - Código de verificación de 6 dígitos para envíos especiales
  - Validez de 5 minutos
  - Notificación a administradores activos

### Panel de Administración
- **CRUD Completo** de usuarios
- **Gestión de Roles**:
  - `Administrador` - Acceso total
  - `Auditor` - Visualización de actividades
  - `Reportes` - Generación de reportes
  - `Morosidad` - Envío de mensajes de morosidad
  - `Propiedades` - Envío de mensajes de propiedades
  - `EnviosDeMensajes` - Envíos masivos
- **Control de Estado**: Activación/desactivación de usuarios
- **Eliminación Lógica** - No destrucción de datos

- ### Restricciones de Seguridad
  - Los usuarios no pueden auto-modificarse
  - Los administradores no pueden auto-eliminarse
  - Validación de roles redundantes
  - Control de sesiones JWT

- ### Gestión de Usuarios
- Solo usuarios con rol **Administrador** pueden:
  - Crear nuevos usuarios
  - Modificar roles y estados
  - Eliminar usuarios lógicamente

- **Restricciones de auto-modificación**:
  - No puede cambiarse su propio rol
  - No puede desactivarse a sí mismo
  - No puede eliminarse a sí mismo

###  Registro de Actividades
- **Últimas 50 consultas** y **últimos 50 envíos**
- **Filtros en tiempo real** por columnas
- **Paginación** con carga incremental
- **Exportación a CSV** de datos filtrados

### Sistema de Reportes
- **MetaBase integrado** para análisis avanzado
- Reportes personalizados según necesidades del cliente
- Visualización embebida en la aplicación

## Instalación

### Instalación Local
```bash
# Clonar repositorio
git clone [url-del-repositorio]

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

## Configuración

### Variables de Entorno
> Crea un archivo `.env` con las siguientes variables:
> ```env
> VITE_BASE_URL_SERVER=tu_backend_url
> ```

### Configuración Nginx
El proyecto incluye configuración optimizada de Nginx para:
- Servir archivos estáticos
- Proxy reverso para API
- Compresión Gzip
- Cache headers

## Desarrollo

### Scripts Disponibles
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Análisis de código
```

### Gestión de Estado
- Toast notifications con PrimeReact
- Gestión de rutas con React Router
- Estados de carga y error

### Performance
- Build optimizado con Vite
- Compresión Gzip en Nginx
- Cache de assets estáticos
- Carga lazy de componentes

*Este proyecto representa una solución empresarial completa para la gestión de comunicaciones masivas con altos estándares de seguridad y usabilidad.*
