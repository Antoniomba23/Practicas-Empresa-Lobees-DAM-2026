# Proyecto II: Lobees AI Automation Dashboard Challenge

En esta segunda fase de las prácticas empresariales, he desarrollado una **Arquitectura Full-Stack guiada por Agentes de IA** (Claude Code, ChatGPT y Antigravity) para interactuar directamente con el ecosistema del CRM Lobees, prescindiendo por completo de integradores de terceros (como n8n).

## Arquitectura y Logros del Proyecto

La automatización no solo "funciona", sino que opera bajo un flujo de **Auditoría Técnica ("Lobees Tech Audit")** completamente autónomo y trazable. El ecosistema consta de:

1. **Servidor MCP Personalizado (`lobees-mcp/`)**: Servidor programado en Node.js puro usando `@modelcontextprotocol/sdk`. Actúa como puente seguro y semántico entre los Agentes de IA y la API REST del CRM de Lobees.
2. **Backend CDN Remoto (`upload_server.py`)**: Script en Python desplegado en el servidor VPS de Lobees (`185.254.205.197:8026`). Se encarga de recibir, hospedar y servir estáticamente los Dashboards HTML generados por las IAs.
3. **Despliegue Automatizado (`deploy_vps.js`)**: Script que se conecta por SSH/SFTP al VPS para subir y arrancar nuestro servidor remoto como proceso demonizado (`nohup`), garantizando un uptime del 100%.

## Estructura del Repositorio

- **`lobees-mcp/`**: Código fuente en JS puro de nuestro Servidor Model Context Protocol.
- **`CLAUDE.md` / `.claude/`**: Reglas globales de comportamiento e inyección del servidor MCP para la ejecución de Claude Code vía CLI local.
- **`chatgpt/`**: Esquemas estandarizados (`openapi-actions.yaml`) e instrucciones de sistema para crear la automatización como un "Custom GPT".
- **`antigravity/`**: Configuración de `workflow.json` para orquestar la IA integrada en el propio IDE.
- **`dashboards/`**: Directorio donde se almacenan físicamente las tres versiones (Claude, ChatGPT, Antigravity) de los Dashboards HTML Premium generados de forma dinámica.
- **`docs/`**: Documentación teórica obligatoria, incluyendo la comparativa exhaustiva del comportamiento de los 3 agentes y la investigación arquitectónica del estándar MCP.

## Flujo de Ejecución del Agente

1. La IA evalúa la cola de Tareas Pendientes a través del MCP.
2. "Simula" una Auditoría Técnica en la infraestructura de cada Lead (generando un Health Score y detectando vulnerabilidades).
3. Transmite los hallazgos en vivo mediante Logs (`lobees_write_log`) para su trazabilidad.
4. Diseña de cero un Dashboard HTML con estética corporativa (`#1A56A0`).
5. Realiza un POST automático a nuestro servidor VPS remoto para hostear el Dashboard y devuelve la URL pública terminada.

---
