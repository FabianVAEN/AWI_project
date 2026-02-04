-- 1. Crear extensiones o tipos necesarios
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_seguimiento') THEN
        CREATE TYPE estado_seguimiento AS ENUM ('pendiente', 'completado');
    END IF;
END $$;

-- 2. Tabla de Categorías
CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    icono VARCHAR(100)
);

-- 3. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    primer_nombre VARCHAR(50) NOT NULL,
    segundo_nombre VARCHAR(50),
    email VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla de Habitos
CREATE TABLE IF NOT EXISTS habitos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion_breve VARCHAR(255) NOT NULL,
    descripcion_larga TEXT,
    es_predeterminado BOOLEAN DEFAULT TRUE,
    categoria_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 5. Tabla Intermedia: usuario_habitos
CREATE TABLE IF NOT EXISTS usuario_habitos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    habito_id INTEGER REFERENCES habitos(id) ON DELETE CASCADE,
    racha_actual INTEGER DEFAULT 0,
    racha_maxima INTEGER DEFAULT 0,
    UNIQUE(usuario_id, habito_id)
);

-- 6. Tabla de Seguimiento
CREATE TABLE IF NOT EXISTS seguimiento (
    id SERIAL PRIMARY KEY,
    usuario_habito_id INTEGER REFERENCES usuario_habitos(id) ON DELETE CASCADE,
    fecha DATE DEFAULT CURRENT_DATE,
    estado estado_seguimiento DEFAULT 'pendiente',
    UNIQUE(usuario_habito_id, fecha)
);

-- INSERCIÓN DE DATOS INICIALES (SEMILLAS)
INSERT INTO categorias (nombre, descripcion, icono) VALUES 
('Consumo Consciente', 'Hábitos para reducir residuos y mejorar la nutrición.', 'fa-leaf'),
('Energía Vital', 'Descanso y eficiencia energética.', 'fa-bolt'),
('Movimiento Verde', 'Actividad física y transporte sostenible.', 'fa-bicycle'),
('Mente y Entorno', 'Bienestar mental y minimalismo.', 'fa-brain');

INSERT INTO habitos (nombre, descripcion_breve, descripcion_larga, categoria_id) VALUES 
('Beber 8 vasos de agua', 'Mantén tu cuerpo hidratado y con energía.', 'Utiliza un termo reutilizable. Evitar botellas de plástico de un solo uso reduce la demanda de petróleo y evita que microplásticos entren en tu organismo y en los océanos.', 1),
('Comer 5 porciones de vegetal', 'Aporta vitaminas y minerales esenciales.', 'Prioriza productos locales y de temporada. Esto reduce las emisiones de CO2 por transporte ("kilómetros alimentarios") y apoya a los agricultores de tu comunidad.', 1),
('Lunes sin carne', 'Reduce el consumo de proteína animal.', 'La industria ganadera consume el 70% del agua dulce mundial. Reducir su consumo baja tu riesgo de enfermedades cardíacas y ahorra miles de litros de agua.', 1),
('Dormir 8 horas', 'Descansa para recuperar cuerpo y mente.', 'Un sueño reparador mejora tu capacidad de tomar decisiones conscientes. Además, apagar las luces y equipos a tiempo reduce el gasto innecesario de energía eléctrica.', 2),
('Desconectar dispositivos', 'Evita la luz azul una hora antes de dormir.', 'Eliminas el "consumo vampiro" (electricidad que gastan los equipos en stand-by) y permites que tu cerebro produzca melatonina de forma natural.', 2),
('Aprovechar luz natural', 'Realiza actividades cerca de ventanas.', 'La exposición moderada al sol activa la Vitamina D en tu piel. Al usar menos luz artificial, disminuyes la huella energética de tu hogar.', 2),
('Hacer ejercicio 30 min', 'Mantén tu corazón sano y activo.', 'Si te ejercitas al aire libre, conectas con la naturaleza (Biofilia), lo cual reduce el cortisol. No usar máquinas eléctricas de gimnasio ahorra energía.', 3),
('Caminar 10,000 pasos', 'Mejora la circulación con movimiento constante.', 'Si usas tus piernas en lugar del auto para distancias cortas, eliminas emisiones de gases de efecto invernadero y mejoras tu capacidad aeróbica.', 3),
('Estiramientos matutinos', 'Despierta tus articulaciones.', 'Prevenir lesiones significa un cuerpo funcional que requiere menos intervenciones médicas y fármacos a largo plazo, reduciendo residuos químicos.', 3),
('Usar escaleras', 'Fortalece piernas y mejora resistencia.', 'Es ejercicio cardiovascular gratuito. Además, ahorras la electricidad necesaria para mover el motor del ascensor en cada piso.', 3),
('Meditar', 'Calma tu mente y reduce el estrés.', 'La paz mental combate el consumo compulsivo por ansiedad. Una persona equilibrada valora lo que ya tiene y compra de forma más responsable.', 4),
('Leer 20 páginas', 'Estimula tu cerebro y amplía conocimientos.', 'Opta por libros usados, bibliotecas digitales o intercambios. Compartir cultura es una forma de economía circular que salva árboles.', 4),
('Practicar gratitud', 'Escribe 3 cosas por las que agradeces.', 'La gratitud nos aleja de la cultura del "necesito más". Valorar lo esencial es el primer paso hacia un estilo de vida minimalista y sostenible.', 4),
('Digital Detox', 'Borra correos basura y archivos viejos.', 'El almacenamiento en la nube gasta mucha energía en servidores. Borrar "basura digital" ayuda a reducir la huella de carbono de los centros de datos.', 4),
('Baño de 5 minutos', 'Higiene personal optimizando el agua.', 'Una ducha corta ahorra hasta 40 litros de agua. También reduces el consumo de gas o electricidad necesarios para calentar el agua.', 1);