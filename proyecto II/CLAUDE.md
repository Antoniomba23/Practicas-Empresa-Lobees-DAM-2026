# Lobees Automation Skills

## Skill: generate-automation-dashboard
Trigger: "genera el dashboard para la tarea [task_id]"
Pasos que ejecuta el agente:
1. Llama a lobees_get_task con el task_id proporcionado para obtener los datos de la tarea.
2. Llama a lobees_get_leads_by_task para obtener la lista de leads asociados.
3. Llama a lobees_get_logs para recuperar el historial de actividad.
4. Construye un HTML autocontenido con:
   - Cabecera con nombre de la tarea, fecha de generación y herramienta de IA utilizada (Claude Code).
   - Tabla de métricas: leads totales, completados por paso, confirmados, pendientes, errores.
   - Tabla de leads con columnas: nombre, email, estado actual, Health Score, Vulnerabilidades detectadas y último log.
   - Timeline de actividad con los logs de la tarea.
   - Sección de metadatos: tiempo total de ejecución, número de llamadas al MCP realizadas.
5. El HTML debe ser responsive, usar colores corporativos (azul primario #1A56A0, fondo claro #EBF2FB) y funcionar sin dependencias externas (CSS embebido, sin CDN).
6. Llama a lobees_publish_dashboard con el taskId y el HTML generado.
7. Escribe un log con lobees_write_log: 'Dashboard generado y publicado', level: success.
8. Devuelve la URL pública del dashboard al usuario.

## Skill: run-automation-task
Trigger: "ejecuta la tarea de automatización [task_id]"
Pasos que ejecuta el agente:
1. Llama a lobees_update_task_status con status: 'in_progress'.
2. Llama a lobees_get_leads_by_task para obtener los leads.
3. Para cada lead: llama a lobees_write_log con 'Procesando lead [nombre]', level: info.
4. Procesa cada lead ejecutando el caso 'Lobees Tech Audit': simula la evaluación de su stack tecnológico actual, asigna una puntuación de salud (0-100) y detecta dos vulnerabilidades técnicas clave. Escribe un log adicional con estos hallazgos para que consten en el CRM y añádelos a la memoria para el Dashboard.
5. Actualiza las métricas con lobees_update_metrics después de procesar cada lead.
6. Al terminar todos los leads: llama a generate-automation-dashboard para generar el dashboard de resultados.
7. Llama a lobees_update_task_status con status: 'completed'.
8. Si ocurre algún error en cualquier paso: llama a lobees_write_log con level: error y luego a lobees_update_task_status con status: 'error'.

## Skill: check-pending-and-run
Trigger: "revisa si hay tareas pendientes y procésalas"
Pasos que ejecuta el agente:
1. Llama a lobees_list_pending_tasks.
2. Si no hay tareas pendientes: informa al usuario y termina.
3. Si hay tareas pendientes: muestra la lista al usuario con id, nombre y número de leads.
4. Pregunta al usuario si debe procesar todas o solo una específica.
5. Para cada tarea a procesar: ejecuta la skill run-automation-task.
6. Al finalizar: muestra un resumen con el número de tareas procesadas y las URLs de dashboards generados.
