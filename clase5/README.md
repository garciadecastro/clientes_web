# dv-cwm-2025-2-t
Cursada de Clientes Web Mobile en Da Vinci 2025 2do cuatrimestre turno tarde, modalidad virtual

# Gambito Club — Parcial 1

**Alumno:** Carlos García de Castro  
**Materia:** Clientes Web Mobile  
**Institución:** Escuela Da Vinci  
**Año:** 2025  

---

## Descripción del proyecto
**Gambito Club** es una red social para aficionados al ajedrez desarrollada con **Vue 3**, **Supabase** y **Tailwind CSS**.  
Permite registrarse, iniciar sesión, editar el perfil, publicar mensajes, reaccionar a publicaciones y participar en un chat global.  

La aplicación combina autenticación persistente, manejo de base de datos en tiempo real y una interfaz adaptable para entornos web y móviles.

---

## Tecnologías utilizadas
- **Frontend:** Vue 3 + Vite  
- **Estilos:** Tailwind CSS  
- **Backend:** Supabase (Auth, Database y Realtime)  
- **Routing:** Vue Router  
- **Control de versiones:** Git + GitHub  

---

## Funcionalidades principales
1. **Autenticación con Supabase**  
   Registro, inicio y cierre de sesión, con persistencia de usuario y perfil asociado.  

2. **Gestión de perfiles**  
   Edición de datos personales, biografía, país, ELO, título y avatar.  

3. **Muro de publicaciones**  
   Cada usuario puede crear publicaciones, ver las de otros miembros y reaccionar con “me gusta” o “no me gusta”.  

4. **Chat global en tiempo real**  
   Canal compartido donde los usuarios autenticados pueden conversar con mensajes instantáneos.  

5. **Listado de miembros**  
   Vista general de todos los jugadores registrados, con acceso a sus perfiles públicos.  

6. **Sistema de rutas protegido**  
   Acceso restringido a rutas que requieren autenticación mediante `beforeEach()` en Vue Router.  

---

## Comentarios técnicos
- Cada archivo `.js` y `.vue` incluye **documentación JSDoc** o comentarios explicativos siguiendo las normas del curso.  
- Se simplificó el uso de Tailwind para priorizar legibilidad y coherencia visual.  
- El patrón **Observer** implementado en `auth.js` permite que cualquier componente reciba actualizaciones automáticas del estado de autenticación sin depender directamente del router.  
- El diseño mantiene compatibilidad con pantallas móviles sin requerir media queries adicionales.  

---

## Ejecución del proyecto
1. Instalar dependencias  
    npm install

2. Iniciar el servidor de desarrollo
    npm run dev

3. Abrir en el navegador
    http://localhost:5173
    