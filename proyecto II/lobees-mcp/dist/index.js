import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Configurar dotenv
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const LOBEES_API_URL = process.env.LOBEES_API_URL || "https://app.lobees.com/api";
const LOBEES_API_TOKEN = process.env.LOBEES_API_TOKEN;
const DEPLOY_API_URL = process.env.DEPLOY_API_URL || "https://dashboards.lobees.com/api/upload";
const DEPLOY_TOKEN = process.env.DEPLOY_TOKEN;

// Validar credenciales base (solo un warning, por si se inyectan más tarde)
if (!LOBEES_API_TOKEN) {
    console.error("WARNING: LOBEES_API_TOKEN no está configurado en el .env");
}

const server = new Server(
    { name: "lobees-mcp", version: "1.0.0" },
    { capabilities: { tools: {} } }
);

// Utilidad para hacer fetch a la API de Lobees usando Bearer Token
async function fetchLobees(endpoint, method = "GET", body = null) {
    const url = endpoint.startsWith("http") ? endpoint : `${LOBEES_API_URL}${endpoint}`;
    
    const headers = { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOBEES_API_TOKEN}`
    };
    
    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Error en API de Lobees (${response.status}): ${await response.text()}`);
    }
    return response.json();
}

// 1. Definir las herramientas expuestas por nuestro MCP
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "lobees_list_pending_tasks",
                description: "Lista todas las tareas de automatización pendientes en el CRM.",
                inputSchema: { type: "object", properties: {} }
            },
            {
                name: "lobees_get_task",
                description: "Devuelve el detalle completo de una tarea por su ID.",
                inputSchema: { type: "object", properties: { taskId: { type: "string" } }, required: ["taskId"] }
            },
            {
                name: "lobees_update_task_status",
                description: "Cambia el estado de una tarea (pending / in_progress / completed / error).",
                inputSchema: { type: "object", properties: { taskId: { type: "string" }, status: { type: "string" } }, required: ["taskId", "status"] }
            },
            {
                name: "lobees_get_leads_by_task",
                description: "Devuelve todos los leads asociados a una tarea.",
                inputSchema: { type: "object", properties: { taskId: { type: "string" } }, required: ["taskId"] }
            },
            {
                name: "lobees_write_log",
                description: "Escribe una entrada en el log de actividad de la tarea.",
                inputSchema: { type: "object", properties: { taskId: { type: "string" }, message: { type: "string" }, level: { type: "string" } }, required: ["taskId", "message"] }
            },
            {
                name: "lobees_get_logs",
                description: "Lee el historial de logs de una tarea.",
                inputSchema: { type: "object", properties: { taskId: { type: "string" } }, required: ["taskId"] }
            },
            {
                name: "lobees_update_metrics",
                description: "Actualiza los contadores de progreso del Dashboard de la tarea.",
                inputSchema: { type: "object", properties: { taskId: { type: "string" }, processed: { type: "number" } }, required: ["taskId"] }
            },
            {
                name: "lobees_publish_dashboard",
                description: "Publica un HTML en el servidor de despliegue.",
                inputSchema: { type: "object", properties: { taskId: { type: "string" }, html: { type: "string" } }, required: ["taskId", "html"] }
            }
        ]
    };
});

// 2. Lógica de ejecución de las herramientas
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const toolName = request.params.name;
    const args = request.params.arguments || {};
    let result;

    try {
        switch (toolName) {
            case "lobees_list_pending_tasks":
                // Utilizando el esquema REST estándar (pendiente de confirmar endpoint exacto con el tutor si falla)
                result = await fetchLobees("/project/tasks/pending");
                break;
            case "lobees_get_task":
                result = await fetchLobees(`/project/task/${args.taskId}`);
                break;
            case "lobees_update_task_status":
                // Usando el endpoint que conocemos de la Semana 1
                result = await fetchLobees(`/project/updatetask/${args.taskId}`, "PUT", { status: args.status });
                break;
            case "lobees_get_leads_by_task":
                result = await fetchLobees(`/project/task/${args.taskId}/leads`);
                break;
            case "lobees_write_log":
                // Usando el endpoint que conocemos de la Semana 1
                result = await fetchLobees(`/project/addtasklog`, "POST", { projecttask: args.taskId, description: args.message, level: args.level || 'info' });
                break;
            case "lobees_get_logs":
                result = await fetchLobees(`/project/task/${args.taskId}/logs`);
                break;
            case "lobees_update_metrics":
                // Endpoint visto en la Semana 1
                result = await fetchLobees(`/project/updatetaskdashboard/${args.taskId}`, "PUT", { processedLeads: args.processed });
                break;
            case "lobees_publish_dashboard":
                const deployUrl = DEPLOY_API_URL.includes("?token=") ? DEPLOY_API_URL : `${DEPLOY_API_URL}?token=${DEPLOY_TOKEN}`;
                const deployRes = await fetch(deployUrl, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ taskId: args.taskId, html: args.html })
                });
                if (!deployRes.ok) throw new Error("Fallo publicando Dashboard en Lobees");
                result = await deployRes.json(); // { publicUrl: "..." }
                break;
            default:
                throw new Error(`Herramienta no reconocida: ${toolName}`);
        }

        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    } catch (error) {
        return { content: [{ type: "text", text: `Error MCP: ${error.message}` }], isError: true };
    }
});

// 3. Iniciar el servidor con el transporte Stdio
async function runServer() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

runServer().catch(err => {
    console.error("Error fatal en el servidor MCP:", err);
    process.exit(1);
});
