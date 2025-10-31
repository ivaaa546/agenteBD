--Muéstrame todos los usuarios registrados en el sistema
SELECT id_usuario, nombre, correo, rol, fecha_registro, activo 
FROM usuarios;

--Lista los productos que ya no tienen stock.
SELECT id_producto, nombre, precio 
FROM productos 
WHERE stock = 0;

--Quiero ver los pedidos que aún están pendientes.
SELECT id_pedido, id_usuario, fecha_pedido, total 
FROM pedidos 
WHERE estado = 'pendiente';

--Muéstrame las reseñas del producto con ID 5
SELECT r.id_resena, u.nombre AS usuario, r.calificacion, r.comentario, r.fecha 
FROM resenas r
JOIN usuarios u ON r.id_usuario = u.id_usuario
WHERE r.id_producto = 5;


--  
SELECT COUNT(*) AS total_usuarios_activos 
FROM usuarios 
WHERE activo = TRUE;

--Dame los 5 productos más caros.
SELECT nombre, precio 
FROM productos 
ORDER BY precio DESC 
LIMIT 5;

--Inserta un nuevo usuario llamado Ana López con correo ana@example.com y rol administrador.
INSERT INTO usuarios (nombre, correo, contraseña, rol) 
VALUES ('Ana López', 'ana@example.com', 'contraseña123', 'administrador');

SELECT * FROM usuarios;

--Actualizar el estado de un pedido
UPDATE pedidos 
SET estado = 'pagado' 
WHERE id_pedido = 10;

select * from pedidos

--Eliminar el usuario con ID 12.
DELETE FROM usuarios 
WHERE id_usuario = 12;

--Ver productos y su categoría
SELECT p.id_producto, p.nombre AS producto, c.nombre AS categoria, p.precio 
FROM productos p
LEFT JOIN categorias c ON p.id_categoria = c.id_categoria;

---Mostrar todos los usuarios activos:
SELECT id_usuario, nombre, correo, rol, telefono, fecha_registro 
FROM usuarios 
WHERE activo = TRUE;

---Mostrar todos los productos con stock mayor a 0:
SELECT id_producto, nombre, precio, stock, id_categoria 
FROM productos 
WHERE stock > 0;

---Mostrar reseñas de un producto (simulación de JOIN con usuarios)
SELECT r.id_resena, u.nombre AS usuario, r.calificacion, r.comentario, r.fecha
FROM resenas r
JOIN usuarios u ON r.id_usuario = u.id_usuario
WHERE r.id_producto = 5;


--Mostrar detalle de un pedido específico (ID = 3)
SELECT dp.id_detalle, p.nombre AS producto, dp.cantidad, dp.precio_unitario
FROM detalle_pedido dp
JOIN productos p ON dp.id_producto = p.id_producto
WHERE dp.id_pedido = 3;

SELECT id_producto, nombre, precio, stock
FROM productos
WHERE id_categoria = 2;

--Ver los productos que hay en cada pedido
SELECT dp.id_detalle, p.id_pedido, prod.nombre AS producto, dp.cantidad, dp.precio_unitario
FROM detalle_pedido dp
JOIN productos prod ON dp.id_producto = prod.id_producto
JOIN pedidos p ON dp.id_pedido = p.id_pedido;

select * from usuarios


Actualizar el estado del usuario ID 11 a activado