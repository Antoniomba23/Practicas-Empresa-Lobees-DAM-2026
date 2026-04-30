# Investigación y Diseño del MCP en Lobees

Este documento atiende a la **Sección 9** del reto de automatización, exponiendo nuestro proceso de investigación técnica, la interpretación del Model Context Protocol dentro del ecosistema de Lobees y el diseño adoptado para su implementación práctica.

## 1. Investigación: ¿Qué es un MCP?

El **Model Context Protocol (MCP)** es un estándar abierto impulsado por Anthropic diseñado para resolver uno de los mayores cuellos de botella de los LLMs (Grandes Modelos de Lenguaje): su aislamiento del mundo real y de la información privada o dinámica.

En la industria tecnológica actual, los agentes de IA (como Claude, ChatGPT u otros orquestadores) a menudo carecen de conocimiento sobre los datos en vivo de una empresa o la capacidad de tomar acciones sobre ellos sin desarrollos personalizados y rígidos en cada integración. El **MCP soluciona esto** estructurando y estandarizando la forma en la que una aplicación (el "Servidor MCP") expone recursos compartidos (como APIs), promputs y **herramientas (tools)** a una IA (el "Cliente MCP").

**El problema central que resuelve** no es conectar dos sistemas (una API REST ya lo hace). El problema que resuelve es dotar de *descubrimiento semántico* y llamadas de función estandarizadas a los modelos, de tal manera que el LLM entienda qué acciones puede tomar y qué inputs necesitan de forma universal, agilizando el flujo de trabajo sin intervención humana constante.

## 2. Interpretación en el Contexto de Lobees

Lobees opera bajo un modelo de arquitectura basado en la modularidad (CRM, Proyectos, Facturación, etc.). Añadir las bondades de la IA Generativa al flujo de trabajo corporativo mediante MCP ofrece ventajas incalculables.

### Encaje dentro de la arquitectura
En Lobees, el Servidor MCP no reemplaza a la API REST actual; actúa como una **capa de abstracción y seguridad semántica** por encima de ella. Su responsabilidad es traducir las intenciones y contextos generados de forma espontánea por la IA hacia acciones deterministas (llamadas HTTP) sobre los distintos módulos de Lobees existentes. 

### Casos de uso reales 
La implementación directa de este patrón abre vías como:
1. **Delegación total del ciclo de gestión de Leads**: Como se demuestra en el reto actual, los agentes de IA pueden consultar por sí solos las tareas con leads pendientes, analizarlos, tomar una decisión operativa y retroalimentar al CRM cambiando el estado de la tarea y actualizando los logs individualizados.
2. **Asistencia reactiva en tiempo real**: Un usuario, mediante chat o interfaz basada en agentes acoplada al CRM, puede solicitar en lenguaje natural *"Actualiza todas las métricas pendientes a estado completado"*, delegando la lógica de las múltiples llamadas en el Cliente IA conectado vía MCP.
3. **Orquestación con integraciones externas**: Un Servidor MCP puede actuar sobre Lobees mientras un segundo Servidor MCP actúa sobre servicios contables; es decir, la IA se convertiría en el integrador entre dos sistemas usando un protocolo universal único. 

## 3. Diseño de la Propuesta de Implementación

Hemos construido el servidor MCP apoyándonos en el SDK nativo de `@modelcontextprotocol/sdk` desarrollado sobre Node.js, garantizando rapidez y soporte continuo.

### Capacidades Expuestas (Tools)
El servidor expone un set restringido pero poderoso de herramientas del CRM, limitando a la IA a estas capacidades operativas:
- **Lectura Contextual**: `lobees_list_pending_tasks`, `lobees_get_task`, `lobees_get_leads_by_task`, `lobees_get_lead`, `lobees_get_logs`. Sirven para que el Cliente IA se haga una "imagen mental" del trabajo pendiente.
- **Mutación y Registro**: `lobees_update_task_status`, `lobees_write_log`, `lobees_update_metrics`. Conceden capacidad de alterar y asentar el progreso realizado en la propia base de datos del CRM.
- **Acciones Estructurales Extra**: `lobees_publish_dashboard`, `lobees_get_dashboard_url`. Generación y publicación física de entregables.

### Método de Invocación
La comunicación entre la IA y el Servidor MCP se ha orquestado a través de **`stdio` (Standard Input/Output) localmente** para clientes nativos (como Claude Code), permitiendo respuestas rápidas y seguras, ya que la IA inicia bajo el mismo entorno que el MCP. Este código, de forma transparente, transforma cada respuesta al ecosistema Lobees mediante peticiones **HTTPS REST**.

### Seguridad, Trazabilidad y Permisos
- **Autenticación al CRM**: El Servidor MCP utiliza internamente el estándar de seguridad universal `Authorization: Bearer <LOBEES_API_TOKEN>`, garantizando el rigor de acceso al ecosistema Lobees.
- **Trazabilidad (Logs)**: Nuestra herramienta `lobees_write_log` es crítica en la estructura. Obliga a que la IA no trabaje como una 'caja negra'. Por cada acción sobre un lead, la IA inyecta en el software de Lobees una trazabilidad observable y transparente para el evaluador humano o tutor. Solo tras lograr este registro satisfactorio se altera el estatus global de la entidad (`pending` -> `in_progress` -> `completed`). 
