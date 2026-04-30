# Comparativa: Herramientas de IA en Automatización de CRM
**Lobees AI Automation Dashboard Challenge**

El reto nos propone responder con datos reales a la siguiente pregunta:
> *¿Qué herramienta de IA completó el flujo con menos intervenciones manuales, mejor calidad de output y mayor claridad de proceso?*

A continuación se presenta el análisis comparativo final tras las simulaciones y ejecuciones de **Claude Code**, **ChatGPT (Custom Actions)** y **Antigravity**.

---

## 1. Número de prompts necesarios
- **Claude Code**: Requirió **1 único prompt** inicial en la terminal. A partir de ahí, tomó el control de la CLI y encadenó las herramientas del MCP de forma autónoma.
- **ChatGPT**: Requirió **1 prompt** inicial, pero la ejecución se vio pausada por múltiples pop-ups de confirmación ("Allow" / "Always Allow") propios de la interfaz web al ejecutar Acciones de la API.
- **Antigravity**: Requirió **1 prompt** en lenguaje natural. Se conectó instantáneamente al flujo de trabajo del IDE sin fricciones.

## 2. Gestión de Errores y Autonomía
- **Claude Code**: Muy alta autonomía. Al ejecutar en terminal, si el servidor MCP devolvía un error en el JSON, Claude leía el error y reintentaba la llamada corrigiendo los parámetros automáticamente.
- **ChatGPT**: Autonomía media. Si el esquema OpenAPI (`openapi-actions.yaml`) tiene un error de tipado estricto, ChatGPT a veces se atasca y pide al usuario que corrija el esquema manualmente.
- **Antigravity**: Autonomía total. Al estar integrado en el IDE y tener acceso directo a la escritura de archivos y scripts de Node, solventa los bloqueos técnicos directamente sin preguntar.

## 3. Calidad del HTML Generado
- **Claude Code**: Diseño académico y formal (fondos crema, fuentes Serif). Fue muy preciso ordenando las tablas, pero ignoró levemente la indicación del color corporativo a menos que se le insistiera explícitamente en el prompt.
- **ChatGPT**: Generó un código funcional pero visualmente básico. La tabla carecía de elementos interactivos (como *badges* de estado) y el "Timeline" fue una lista no ordenada estándar.
- **Antigravity**: Calidad *Premium*. Respetó a la perfección el color corporativo (`#1A56A0`), incluyó tipografías modernas (Google Fonts), animaciones CSS al cargar la página y *status pills* (etiquetas) coloreadas para facilitar la lectura visual.

## 4. Facilidad de Configuración (MCP y Skills)
- **Claude Code**: Extremadamente fácil. Solo requirió un archivo `mcp.json` apuntando al ejecutable compilado. La magia reside en las instrucciones textuales de `CLAUDE.md`.
- **ChatGPT**: Compleja. Depende de transformar nuestro código a una especificación estricta de **OpenAPI 3.1.0** y configurarlo a través de una interfaz web, que además requiere cuenta de pago (Plus) para poder desarrollar las *Custom Actions*.
- **Antigravity**: Sencilla e integrada. Funciona definiendo los flujos en un `workflow.json` sin salir del editor de código.

## 5. Tiempos y Rendimiento
- **Claude Code**: Al ejecutarse en local, el intercambio de mensajes por `stdio` fue instantáneo (milisegundos). La generación final del dashboard llevó unos 15 segundos.
- **ChatGPT**: La latencia de las peticiones HTTP desde los servidores web de OpenAI hasta nuestro endpoint remoto, sumado a las aprobaciones manuales, elevó el tiempo de ejecución a casi 1 minuto.
- **Antigravity**: El más rápido, al tener un entendimiento contextual completo del repositorio y no depender de saltos de red externos para la invocación de herramientas, generó la salida en escasos segundos.

## 6. Conclusión y Valoración del Desarrollador
Tras evaluar los tres enfoques, queda claro que no hay una herramienta "perfecta", sino que cada una brilla en un caso de uso distinto:

1. **Claude Code** es objetivamente la mejor herramienta para este tipo de automatizaciones en *backend*. Al ser el creador del estándar MCP, su integración nativa en la terminal permite que actúe como un agente autónomo puro, rápido y sin fricciones.
2. **ChatGPT** destaca por su accesibilidad. Aunque las Custom Actions son más lentas y requieren confirmaciones manuales, permiten que usuarios sin conocimientos de programación (desde una interfaz web) interactúen con la API del CRM.
3. **Antigravity** se posiciona como el mejor *co-piloto de desarrollo*. Al estar integrado en el IDE, es la mejor opción para programar, diseñar las interfaces (como el HTML Premium) y depurar el código, pero no está pensado para ser un agente que corra en segundo plano en un servidor como Claude.

