# Solución para el Lobees Automation Integration Challenge

He desarrollado este sistema para resolver el reto de integración de automatización de Lobees CRM. Mi objetivo ha sido conectar el CRM con un flujo de trabajo en n8n y un servicio backend propio de una forma eficiente y siguiendo los requisitos del proyecto.

## Cómo he estructurado el sistema

Para que todo funcione de forma coordinada, he dividido la solución en tres partes fundamentales:

1. Lobees CRM: Donde gestiono los leads y las tareas, y donde se guardan los logs de actividad.
2. Workflow de n8n: Es el motor que he configurado para mover la información y actualizar el CRM automáticamente.
3. Servicio Backend (Node.js): El servidor que he programado para alojar los formularios y capturar las respuestas.

## Organización del proyecto

He organizado los archivos siguiendo la estructura solicitada en el reto:

- /backend-service: Aquí tengo el código de mi servidor Express.
- /n8n-workflow: Donde he guardado el archivo JSON con mi flujo de n8n.
- /forms: Los archivos HTML y CSS de mis formularios.
- /docs: La documentación adicional y esquemas.

## Cómo ponerlo en marcha

### 1. Servidor Backend
Para arrancarlo, entro en la carpeta y ejecuto los comandos habituales:
```bash
cd backend-service
npm install
node server.js
```
El servidor se queda escuchando en el puerto 3000 por defecto.

### 2. Configuración de n8n
He preparado un archivo JSON en la carpeta /n8n-workflow que se puede importar directamente en n8n. He dejado configurados los webhooks en modo producción y los nodos para que se comuniquen con la API de Lobees usando mi token.

### 3. Variables de entorno
He usado un archivo .env dentro de backend-service para no dejar las URLs de los webhooks expuestas directamente en el código.

## Endpoints que he creado

Para gestionar los formularios, he habilitado las siguientes rutas:
- GET /lead/:id/form1, form2 y form3 para mostrar las páginas.
- POST /lead/:id/form1, form2 y form3 para procesar lo que escribe el lead y enviarlo a n8n.

## Lógica de mi automatización
He configurado el flujo para que detecte cuando un lead completa un paso, traduzca la respuesta a un formato JSON que Lobees entienda y lo suba como un log a la tarea correspondiente.

Además, he incluido las siguientes funciones automáticas:

- **Cierre de Tarea**: Al completar el Formulario 3, el flujo cambia el estado de la tarea a "Finalizada" automáticamente.
- **Polling**: El sistema busca tareas nuevas cada 15 minutos.
- **Dashboard**: Se actualizan las métricas de progreso de la tarea padre.
