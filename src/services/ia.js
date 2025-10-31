import Groq from "groq-sdk";
import db from './db.js';
import dotenv from 'dotenv';
dotenv.config();

const groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });

const ia = async (req, res) => {
  const { userInput, confirmExecution } = req.body;

  if (!userInput) return res.status(400).json({ error: "No se proporciona userInput" });

  // Detectar si es una consulta válida
  const sqlKeywords = [
    'select', 'insert', 'update', 'delete', 'mostrar', 'listar', 'buscar',
    'cuántos', 'cuantos', 'obtener', 'agregar', 'crear', 'eliminar', 
    'modificar', 'actualizar', 'productos', 'usuarios', 'pedidos',
    'carrito', 'categorias', 'reseñas', 'direcciones'
  ];

  const inputLower = userInput.toLowerCase();
  const hasDbIntent = sqlKeywords.some(keyword => inputLower.includes(keyword));

  if (!hasDbIntent) {
    return res.json({ 
      message: "No entendí tu consulta. Por favor, describe qué información necesitas de la base de datos.",
      suggestion: "Ejemplo: 'Muestra todos los productos', 'Cuántos usuarios activos hay', 'Lista los pedidos recientes'"
    });
  }
  try {
    // NL -> SQL con IA
    const chatCompletion = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: `
        Eres un asistente especializado en bases de datos MYSQL para un e-commerce.

        ESQUEMA DE LA BASE DE DATOS:
        - usuarios: id_usuario, nombre, correo, contrasena, rol, telefono, fecha_registro, activo
        - productos: id_producto, nombre, descripcion, precio, stock, imagen_url, id_categoria, fecha_creacion
        - pedidos: id_pedido, id_usuario, fecha_pedido, total, estado
        - detalle_pedido: id_detalle, id_pedido, id_producto, cantidad, precio_unitario
        - categorias: id_categoria, nombre, descripcion
        - carrito: id_carrito, id_usuario, id_producto, cantidad, fecha_agregado
        - direcciones: id_direccion, id_usuario, id_municipio, direccion_exacta, zona, codigo_postal, referencias, activa
        - departamentos: id_departamento, nombre, codigo
        - municipios: id_municipio, nombre, id_departamento
        - resenas: id_resena, id_usuario, id_producto, calificacion, comentario, fecha

        REGLAS:
        - Responde SOLO con la consulta SQL, sin markdown, sin explicaciones
        - Usa INSERT, UPDATE, DELETE y SELECT
        - Para reseñas: SIEMPRE usa JOIN con usuarios para mostrar nombres
        - Para pedidos: SIEMPRE incluye id_pedido, id_usuario, fecha_pedido, total
        - Para COUNT: usa COUNT(*) AS alias_descriptivo
        - NUNCA uses SELECT * - especifica columnas exactas
        - Evita DROP, TRUNCATE, ALTER
        - Para fechas: usa NOW() en lugar de CURRENT_TIMESTAMP
        - Para consultas de resenas: SELECT r.id_resena, u.nombre AS usuario, r.calificacion, r.comentario, r.fecha FROM resenas r JOIN usuarios u ON r.id_usuario = u.id_usuario WHERE condicion
        - Para consultas de pedidos: SELECT id_pedido, id_usuario, fecha_pedido, total FROM pedidos WHERE condicion
        - Para consultas de conteo: SELECT COUNT(*) AS total_usuarios_activos FROM usuarios WHERE condicion
                `},
        { role: "user", content: userInput }
      ]
    });

    let sqlQuery = chatCompletion.choices[0].message.content
      .replace(/```sql|```/g, "")
      .trim();
      

    const isWriteQuery = /^(INSERT|UPDATE|DELETE)/i.test(sqlQuery);

    // Confirmacion para escritura
    if (isWriteQuery && !confirmExecution) {
      return res.json({
        message: "Esta consulta modificara la base de datos. Confirma antes de ejecutar.",
        sqlQuery
      });
    }

    let result;
    let error = null;

    try {
      // 1 SELECT
      if (/^SELECT/i.test(sqlQuery)) {
        // Detectar si es una consulta con COUNT
        const hasCount = /COUNT\(\*?\)/i.test(sqlQuery);
        
        if (hasCount) {
          // Para MySQL, ejecutamos la consulta COUNT directamente
          try {
            const [rows] = await db.execute(sqlQuery);
            result = { count: rows[0]['COUNT(*)'] || rows[0][Object.keys(rows[0])[0]] };
            return res.json({ sqlQuery, result });
          } catch (countError) {
            return res.status(400).json({ sqlQuery, error: countError.message });
          }
        }
        
        // Para MySQL, ejecutamos todas las consultas SELECT directamente
        try {
          const [rows] = await db.execute(sqlQuery);
          result = rows;
          return res.json({ 
            sqlQuery, 
            result,
            note: "Consulta ejecutada directamente en MySQL"
          });
        } catch (selectError) {
          error = { message: selectError.message };
        }
      } else if (isWriteQuery && confirmExecution) {
        // 2 INSERT, UPDATE, DELETE
        // Para MySQL, ejecutamos las consultas de escritura directamente
        try {
          const [result] = await db.execute(sqlQuery);
          return res.json({ 
            sqlQuery, 
            result: result,
            message: "Consulta ejecutada correctamente"
          });
        } catch (writeError) {
          return res.status(400).json({ 
            sqlQuery, 
            error: writeError.message 
          });
        }
      }
    } catch (execError) {
      error = { message: execError.message };
    }

    if (error) {
      return res.status(400).json({ sqlQuery, error: error.message });
    }

    return res.json({ sqlQuery, result, message: "Consulta ejecutada correctamente" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default ia;
