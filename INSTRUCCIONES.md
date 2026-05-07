# Sistema de Gestión - Male Style ✨

Este sistema permite gestionar las ventas de Shimmer Walls, Glitter Bar y Estructuras, integrando la coordinación con el herrero.

## Credenciales de Acceso
- **Usuario:** `malestyle`
- **Contraseña:** `malestilo`

## Estructura del Proyecto
- `/frontend`: Interfaz de usuario (React + Vite).
- `/backend`: Servidor API y Base de Datos (Node.js + Prisma + PostgreSQL).

## Cómo ejecutarlo

### 1. Backend (Servidor)
1. Entrar a la carpeta `backend`.
2. Asegúrate de tener PostgreSQL corriendo y configurar la URL en el archivo `.env`.
3. Ejecutar: `npm run dev`

### 2. Frontend (Interfaz)
1. Entrar a la carpeta `frontend`.
2. Ejecutar: `npm run dev`
3. Abrir en el navegador: `http://localhost:5173`

## Características Especiales
- **Efecto de Despacho:** Al marcar un pedido como despachado (icono de camión), la fila se tacha automáticamente como en el cuaderno.
- **Control de Saldos:** El sistema calcula automáticamente cuánto debe cada cliente restando la seña del total.
- **Planilla del Herrero:** Vista simplificada para ver qué estructuras hay que pedir y cuánto cuestan.
