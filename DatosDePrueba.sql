INSERT INTO departamentos (nombre, codigo)
VALUES 
('Alta Verapaz', 'GT04'),
('Chimaltenango', 'GT05'),
('Escuintla', 'GT06'),
('Huehuetenango', 'GT07');

INSERT INTO municipios (nombre, id_departamento)
VALUES
('Cobán', 4),
('Tactic', 4),
('Chimaltenango', 5),
('Patzicía', 5),
('Escuintla', 6),
('Santa Lucía Cotzumalguapa', 6),
('Huehuetenango', 7),
('Aguacatán', 7);

INSERT INTO usuarios (nombre, correo, contraseña, rol, telefono, activo)
VALUES
('Lucía Morales', 'lucia.morales@gmail.com', 'hashed_pass4', 'cliente', '5556-4444', TRUE),
('Diego Castillo', 'diego.castillo@gmail.com', 'hashed_pass5', 'cliente', '5556-5555', TRUE),
('Ana Méndez', 'ana.mendez@gmail.com', 'hashed_pass6', 'cliente', '5556-6666', TRUE),
('Pedro García', 'pedro.garcia@gmail.com', 'hashed_pass7', 'cliente', '5556-7777', TRUE),
('Laura Ramírez', 'laura.ramirez@gmail.com', 'hashed_pass8', 'cliente', '5556-8888', FALSE),
('Fernando Díaz', 'fernando.diaz@gmail.com', 'hashed_pass9', 'cliente', '5556-9999', TRUE),
('Claudia Herrera', 'claudia.herrera@gmail.com', 'hashed_pass10', 'cliente', '5557-1111', TRUE),
('Oscar Molina', 'oscar.molina@gmail.com', 'hashed_pass11', 'admin', '5557-2222', TRUE);

INSERT INTO direcciones (id_usuario, id_municipio, direccion_exacta, zona, codigo_postal, referencias, activa)
VALUES
(5, 7, 'Zona 3 Barrio El Carmen', '3', '13001', 'Cerca del instituto nacional', TRUE),
(6, 8, '3a Avenida 4-12', NULL, '13010', 'Frente a la iglesia católica', TRUE),
(7, 9, 'Km 55 Carretera a Antigua', NULL, '03009', 'Residencial Los Robles', TRUE),
(8, 10, '6ta Avenida 8-20', NULL, '05010', 'Casa blanca con portón negro', TRUE),
(9, 11, 'Boulevard Los Olivos 15-80', '1', '05001', 'Frente a centro comercial', TRUE),
(10, 12, 'Colonia La Esperanza Zona 2', '2', '05002', 'Casa azul, portón de madera', FALSE),
(11, 13, 'Residencial El Bosque 4-55', '4', '06001', 'Cerca del parque central', TRUE),
(12, 14, 'Calle Principal 7-14', NULL, '07002', 'Junto a tienda San José', TRUE);

INSERT INTO categorias (nombre, descripcion)
VALUES
('Electrodomésticos', 'Línea blanca y aparatos eléctricos para el hogar'),
('Deportes', 'Artículos deportivos y de ejercicio'),
('Mascotas', 'Productos para cuidado y alimentación de mascotas'),
('Libros', 'Libros y material educativo');


INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url, id_categoria)
VALUES
('Refrigeradora LG 14 pies', 'Refrigeradora moderna con sistema inverter', 3899.99, 10, 'https://example.com/refri.jpg', 5),
('Horno Microondas Samsung', 'Microondas de 1.2 pies cúbicos con pantalla digital', 899.99, 15, 'https://example.com/microondas.jpg', 5),
('Pelota de fútbol Adidas', 'Balón oficial de entrenamiento tamaño 5', 199.99, 50, 'https://example.com/balon.jpg', 6),
('Caminadora eléctrica ProForm', 'Cinta para correr con pantalla LCD', 4999.99, 5, 'https://example.com/caminadora.jpg', 6),
('Croquetas para perro 20kg', 'Alimento completo para perros adultos', 250.00, 40, 'https://example.com/croquetas.jpg', 7),
('Arena para gato 10kg', 'Arena absorbente con fragancia', 120.00, 60, 'https://example.com/arena.jpg', 7),
('Libro: Cien años de soledad', 'Obra maestra de Gabriel García Márquez', 149.99, 30, 'https://example.com/cien_anos.jpg', 8),
('Libro: El principito', 'Clásico universal de Antoine de Saint-Exupéry', 89.99, 25, 'https://example.com/principito.jpg', 8),
('Smart TV Samsung 50"', 'Televisor 4K UHD con conexión Wi-Fi', 3499.00, 8, 'https://example.com/smarttv.jpg', 1),
('Plancha Oster Vapor', 'Plancha con control de temperatura y vapor', 275.00, 20, 'https://example.com/plancha.jpg', 2);


INSERT INTO carrito (id_usuario, id_producto, cantidad)
VALUES
(5, 9, 1),
(6, 10, 1),
(7, 3, 2),
(8, 7, 1),
(9, 8, 1),
(10, 6, 3);

INSERT INTO pedidos (id_usuario, fecha_pedido, total, estado)
VALUES
(5, NOW() - INTERVAL '5 days', 3899.99, 'entregado'),
(6, NOW() - INTERVAL '3 days', 250.00, 'enviado'),
(7, NOW() - INTERVAL '2 days', 449.98, 'pagado'),
(8, NOW() - INTERVAL '1 day', 239.99, 'pendiente'),
(9, NOW(), 3499.00, 'pagado');


INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario)
VALUES
(3, 9, 1, 3499.00),
(3, 10, 1, 275.00),
(4, 3, 2, 350.00),
(5, 5, 1, 250.00),
(6, 1, 1, 4599.99),
(7, 2, 1, 499.50);

INSERT INTO reseñas (id_usuario, id_producto, calificacion, comentario)
VALUES
(5, 9, 5, 'Excelente calidad de imagen, fácil de configurar'),
(6, 5, 4, 'A mi perro le encantó, aunque el saco llegó un poco dañado'),
(7, 7, 5, 'El libro llegó en perfecto estado'),
(8, 3, 3, 'Buen producto pero algo caro'),
(9, 6, 5, 'Perfecta para mi gato, sin olor'),
(10, 8, 5, 'Historia muy bonita, ideal para regalar');
