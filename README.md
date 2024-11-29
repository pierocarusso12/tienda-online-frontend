# Proyecto Frontend - Tienda Online con Next.js

Este proyecto consiste en una **Interfaz de Usuario (UI)** desarrollada con **Next.js** y **React** que interactúa con una API RESTful backend para gestionar un catálogo de productos y un carrito de compras. La aplicación permite a los usuarios ver los productos disponibles, añadirlos a su carrito y ver el total de su carrito.

## Requisitos Previos

- **Node.js** instalado (recomendado versión 16 o superior).
- **npm** o **Yarn** para la gestión de dependencias.

## Configuración del Proyecto

### 1. Clonar el Repositorio

Clona el repositorio en tu máquina local:

```bash
git clone https://github.com/pierocarusso12/tienda-online-frontend.git

### 2. Inicializar el Proyecto

Abrir la terminal y escribir: npm run dev (Primero se ejecuta el backend y luego el frontend)
### Resumen de lo que se ha hecho:

1. **Catálogo de Productos**:
   - Se ha implementado la recuperación de productos desde el backend y su visualización con los detalles (nombre, descripción, precio, imagen).
   - Los usuarios pueden añadir productos al carrito.

2. **Carrito de Compras**:
   - Los usuarios pueden ver los productos añadidos a su carrito.
   - Se muestra el total del carrito.
   - Los usuarios pueden eliminar productos del carrito.

3. **Extras Opcionales**:
   - Se añadieron notificaciones de éxito/error al añadir o eliminar productos.
   - Se implementó la paginación para mejorar la visualización del catálogo cuando hay muchos productos.
