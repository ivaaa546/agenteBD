# Backend: Agente IA (Express + MySQL)
Servicio HTTP que recibe texto en español, lo transforma a SQL con Groq y ejecuta la consulta en MySQL. Incluye UI estática en `public/` para pruebas
Este repositorio contiene un servicio backend en Node.js/Express que convierte lenguaje natural en consultas SQL para un esquema de e‑commerce y las ejecuta en MySQL. Incluye una interfaz web simple en `agente-bakend/public/` para probar el agente.

- Se utilizo la API de https://groq.com/ versión gratuita 

## Frontend de prueba
Abra `public/index.html` en el navegador. El cliente envía las solicitudes a `http://localhost:3000/agente` y muestra resultados en tabla.

## Reglas NL a SQL 
El servicio guía a la IA con un esquema típico de e‑commerce y reglas como:
- No usar `SELECT *`; especificar columnas
- Usar `JOIN` para reseñas con usuarios
- Incluir columnas clave en pedidos
- Evitar `DROP`, `TRUNCATE`, `ALTER`

## Notas:
- Si la consulta es de escritura (INSERT/UPDATE/DELETE) y `confirmExecution` es `false`, el servicio devolverá la consulta para confirmar sin ejecutar.
- Para consultas con `COUNT`, la respuesta incluye `{ count: N }`.
- En los archivos esta la captura de la diagrama entidad relación, tambien el script sql 
- Se incluye el script sql para insertar los datos de prueba

## Requisitos
- Node.js 18+
- MySQL 8+

## Instalación
```
npm install
```

## Estructura
- `agente-bakend/`: servicio Express y cliente web
  - `server.js`: arranque del servidor
  - `src/app.js`: configuración de Express y middlewares
  - `src/routes/ruta_agente.js`: ruta `/agente`
  - `src/services/ia.js`: lógica NL ➜ SQL con Groq y ejecución en MySQL
  - `src/services/db.js`: pool de conexión MySQL
  - `src/services/supabase.js`: cliente opcional de Supabase
  - `public/`: UI estática para pruebas (HTML/CSS/JS)
- `ConsultasEjemplo.md`: ejemplos de consultas SQL
- `2.sql`, `l.sql`: scripts SQL auxiliares

## Variables de entorno (`.env`)
```
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=tu_base

GROQ_API_KEY=sk_...

# Opcional pero en este supabase no permitio hacer joins directos, cambie a otro gestor
SUPABASE_URL=https://...supabase.co
SUPABASE_KEY=...
```

## Ejecutar en desarrollo
```
npm run dev
```
Servidor en `http://localhost:3000`.

## Endpoints
### POST /agente
- Body JSON:
```
{
  "userInput": "Lista los pedidos pendientes",
  "confirmExecution": true
}
```
- Respuestas típicas:
  - SELECT con filas:
```
{
  "sqlQuery": "SELECT id_pedido, id_usuario, fecha_pedido, total FROM pedidos WHERE estado = 'pendiente'",
  "result": [ { "id_pedido": 1, ... } ],
  "note": "Consulta ejecutada directamente en MySQL"
}
```
  - COUNT:
```
{
  "sqlQuery": "SELECT COUNT(*) AS total_usuarios_activos FROM usuarios WHERE activo = TRUE",
  "result": { "count": 42 }
}
```
  - Escrituras sin confirmación:
```
{
  "message": "Esta consulta modificara la base de datos. Confirma antes de ejecutar.",
  "sqlQuery": "UPDATE pedidos SET estado = 'pagado' WHERE id_pedido = 10"
}
```
  - Error:
```
{
  "sqlQuery": "SELECT ...",
  "error": "detalle del error"
}
```

