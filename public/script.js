const form = document.getElementById('chat-form');
const input = document.getElementById('userInput');
const chatBox = document.getElementById('chat');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userText = input.value.trim();
  if (!userText) return;

  // Para mostrar mensaje del usuario
  appendUserMessage(userText);
  input.value = '';

  // Mostrar indicador de carga
  const loadingId = showLoadingMessage();

  try {
    const res = await fetch('http://localhost:3000/agente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userInput: userText, confirmExecution: true })
    });

    const data = await res.json();
    
    // Remover indicador de carga
    removeLoadingMessage(loadingId);
    
    // Mostrar respuesta de la IA
    if (data.error) {
      appendAIMessage(` Error: ${data.error}`, 'error');
    } else if (data.result) {
      let responseText = ` Consulta ejecutada correctamente\n\n`;
      responseText += ` **SQL:** \`${data.sqlQuery}\`\n\n`;
      
      if (Array.isArray(data.result)) {
        responseText += ` **Resultados (${data.result.length} registros):**\n\n`;
        responseText += createTable(data.result);
      } else if (data.result.count !== undefined) {
        responseText += ` **Total:** ${data.result.count}`;
      } else {
        responseText += `**Resultado:** ${JSON.stringify(data.result, null, 2)}`;
      }
      
      if (data.note) {
        responseText += `\n\n ${data.note}`;
      }
      
      appendAIMessage(responseText, 'success');
    } else {
      appendAIMessage(data.message || "No se pudo procesar la consulta", 'info');
    }

  } catch (err) {
    removeLoadingMessage(loadingId);
    appendAIMessage(' Error en la conexión con el servidor', 'error');
  }
});

function appendUserMessage(text) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message user-message';
  
  messageDiv.innerHTML = `
    <div class="message-avatar">
      <i class="fas fa-user"></i>
    </div>
    <div class="message-bubble">
      ${text}
    </div>
  `;
  
  chatBox.appendChild(messageDiv);
  scrollToBottom();
}

function appendAIMessage(text, type = 'info') {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message ai-message';
  
  const icon = type === 'error' ? 'fas fa-exclamation-triangle' : 
              type === 'success' ? 'fas fa-check-circle' : 
              'fas fa-sparkles';
  
  messageDiv.innerHTML = `
    <div class="message-avatar">
      <i class="${icon}"></i>
    </div>
    <div class="message-bubble">
      ${formatMessage(text)}
    </div>
  `;
  
  chatBox.appendChild(messageDiv);
  scrollToBottom();
}

function showLoadingMessage() {
  const loadingId = 'loading-' + Date.now();
  const messageDiv = document.createElement('div');
  messageDiv.id = loadingId;
  messageDiv.className = 'message ai-message';
  
  messageDiv.innerHTML = `
    <div class="message-avatar">
      <i class="fas fa-sparkles"></i>
    </div>
    <div class="message-bubble">
      <div class="loading-dots">
        <span></span><span></span><span></span>
      </div>
      Procesando consulta...
    </div>
  `;
  
  chatBox.appendChild(messageDiv);
  scrollToBottom();
  return loadingId;
}

function removeLoadingMessage(loadingId) {
  const loadingElement = document.getElementById(loadingId);
  if (loadingElement) {
    loadingElement.remove();
  }
}

function formatMessage(text) {
  // Convertir markdown básico a HTML
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\`(.*?)\`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}

function createTable(results) {
  if (results.length === 0) {
    return 'No se encontraron resultados.';
  }
  
  // Obtener todas las columnas únicas
  const allColumns = [...new Set(results.flatMap(item => Object.keys(item)))];
  
  // Crear tabla HTML
  let tableHTML = '<div class="results-table">';
  tableHTML += '<table>';
  
  // Encabezados
  tableHTML += '<thead><tr>';
  allColumns.forEach(column => {
    tableHTML += `<th>${formatColumnName(column)}</th>`;
  });
  tableHTML += '</tr></thead>';
  
  // Filas de datos
  tableHTML += '<tbody>';
  results.forEach((item, index) => {
    tableHTML += '<tr>';
    allColumns.forEach(column => {
      const value = item[column] || '-';
      const formattedValue = formatValue(value);
      const dataType = getValueType(value);
      tableHTML += `<td data-type="${dataType}">${formattedValue}</td>`;
    });
    tableHTML += '</tr>';
  });
  tableHTML += '</tbody>';
  
  tableHTML += '</table>';
  tableHTML += '</div>';
  
  return tableHTML;
}

function formatColumnName(column) {
  // Convertir nombres de columna a formato legible
  const nameMap = {
    'id_usuario': 'ID Usuario',
    'id_producto': 'ID Producto',
    'id_pedido': 'ID Pedido',
    'id_categoria': 'ID Categoría',
    'fecha_pedido': 'Fecha Pedido',
    'fecha_registro': 'Fecha Registro',
    'precio_unitario': 'Precio Unitario',
    'direccion_exacta': 'Dirección',
    'codigo_postal': 'Código Postal',
    'fecha_creacion': 'Fecha Creación'
  };
  
  return nameMap[column] || column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function formatValue(value) {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'boolean') return value ? 'Sí' : 'No';
  if (typeof value === 'number') return value.toLocaleString();
  if (typeof value === 'string' && value.includes('T') && value.includes('Z')) {
    // Formatear fechas
    try {
      const date = new Date(value);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return value;
    }
  }
  return value;
}

function getValueType(value) {
  if (value === null || value === undefined) return 'empty';
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'string' && value.includes('T') && value.includes('Z')) {
    return 'date';
  }
  return 'text';
}

function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Manejar Enter 
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    form.dispatchEvent(new Event('submit'));
  }
});
