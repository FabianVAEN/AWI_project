const { Usuario, Habito, UsuarioHabito, Seguimiento, Categoria, sequelize } = require('../repositories/models');
const bcrypt = require('bcryptjs');

const seed = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a BD exitosa');
        
        // ⚠️ CUIDADO: Esto ELIMINA TODOS LOS DATOS
        console.log('⚠️  Limpiando base de datos...');
        await sequelize.sync({ force: true });
        
        console.log('🚀 Iniciando Seeder de Usuarios con Rachas...');

        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('password123', salt);

        // 1. CREAR CATEGORÍAS
        const categorias = await Categoria.bulkCreate([
            { nombre: 'Consumo Consciente', descripcion: 'Hábitos para reducir residuos', icono: 'fa-leaf' },
            { nombre: 'Energía Vital', descripcion: 'Descanso y eficiencia energética', icono: 'fa-bolt' },
            { nombre: 'Movimiento Verde', descripcion: 'Actividad física y transporte sostenible', icono: 'fa-bicycle' },
            { nombre: 'Mente y Entorno', descripcion: 'Bienestar mental y minimalismo', icono: 'fa-brain' },
            { nombre: 'Personalizado', descripcion: 'Hábitos personalizados', icono: 'fa-user' }
        ]);

        // 2. CREAR HÁBITOS PREDETERMINADOS
        const habitos = await Habito.bulkCreate([
            {
                nombre: 'Beber 8 vasos de agua',
                descripcion_breve: 'Mantén tu cuerpo hidratado y con energía.',
                descripcion_larga: 'Utiliza un termo reutilizable. Evitar botellas de plástico de un solo uso reduce la demanda de petróleo y evita que microplásticos entren en tu organismo y en los océanos.',
                es_predeterminado: true,
                categoria_id: categorias[0].id
            },
            {
                nombre: 'Comer 5 porciones de vegetal',
                descripcion_breve: 'Aporta vitaminas y minerales esenciales.',
                descripcion_larga: 'Prioriza productos locales y de temporada. Esto reduce las emisiones de CO2 por transporte ("kilómetros alimentarios") y apoya a los agricultores de tu comunidad.',
                es_predeterminado: true,
                categoria_id: categorias[0].id
            },
            {
                nombre: 'Hacer ejercicio 30 min',
                descripcion_breve: 'Mantén tu corazón sano y activo.',
                descripcion_larga: 'Si te ejercitas al aire libre, conectas con la naturaleza (Biofilia), lo cual reduce el cortisol. No usar máquinas eléctricas de gimnasio ahorra energía.',
                es_predeterminado: true,
                categoria_id: categorias[2].id
            },
            {
                nombre: 'Meditar',
                descripcion_breve: 'Calma tu mente y reduce el estrés.',
                descripcion_larga: 'La paz mental combate el consumo compulsivo por ansiedad. Una persona equilibrada valora lo que ya tiene y compra de forma más responsable.',
                es_predeterminado: true,
                categoria_id: categorias[3].id
            },
            {
                nombre: 'Dormir 8 horas',
                descripcion_breve: 'Descansa para recuperar cuerpo y mente.',
                descripcion_larga: 'Un sueño reparador mejora tu capacidad de tomar decisiones conscientes. Además, apagar las luces y equipos a tiempo reduce el gasto innecesario de energía eléctrica.',
                es_predeterminado: true,
                categoria_id: categorias[1].id
            }
        ]);

        // 3. CREAR USUARIOS
        const usuarios = await Usuario.bulkCreate([
            {
                username: 'admin',
                primer_nombre: 'Administrador',
                segundo_nombre: 'AWI',
                email: 'admin@awi.com',
                password: password,
                es_admin: true
            },
            {
                username: 'fabian',
                primer_nombre: 'Fabian',
                segundo_nombre: 'Andrés',
                email: 'fabian@test.com',
                password: password,
                es_admin: false
            },
            {
                username: 'mauricio',
                primer_nombre: 'Mauricio',
                segundo_nombre: 'López',
                email: 'mauricio@test.com',
                password: password,
                es_admin: false
            },
            {
                username: 'carlos',
                primer_nombre: 'Carlos',
                segundo_nombre: 'Pérez',
                email: 'carlos@test.com',
                password: password,
                es_admin: false
            },
            {
                username: 'ana',
                primer_nombre: 'Ana',
                segundo_nombre: 'García',
                email: 'ana@test.com',
                password: password,
                es_admin: false
            },
            {
                username: 'luis',
                primer_nombre: 'Luis',
                segundo_nombre: 'Martínez',
                email: 'luis@test.com',
                password: password,
                es_admin: false
            }
        ]);

        const hoy = new Date();

        // --- FABIAN: RACHA PERFECTA DE 30 DÍAS ---
        console.log('📊 Creando datos para Fabian (Racha perfecta 30 días)...');
        const subFabian1 = await UsuarioHabito.create({
            usuario_id: usuarios[1].id,
            habito_id: habitos[0].id,
            racha_actual: 30,
            racha_maxima: 30
        });

        const subFabian2 = await UsuarioHabito.create({
            usuario_id: usuarios[1].id,
            habito_id: habitos[1].id,
            racha_actual: 30,
            racha_maxima: 30
        });

        const subFabian3 = await UsuarioHabito.create({
            usuario_id: usuarios[1].id,
            habito_id: habitos[2].id,
            racha_actual: 30,
            racha_maxima: 30
        });

        // Crear seguimientos para 30 días
        let seguimientosFabian = [];
        for (let i = 0; i < 30; i++) {
            let fecha = new Date();
            fecha.setDate(hoy.getDate() - i);
            const fechaStr = fecha.toISOString().split('T')[0];
            
            seguimientosFabian.push(
                {
                    usuario_habito_id: subFabian1.id,
                    fecha: fechaStr,
                    estado: 'completado'
                },
                {
                    usuario_habito_id: subFabian2.id,
                    fecha: fechaStr,
                    estado: 'completado'
                },
                {
                    usuario_habito_id: subFabian3.id,
                    fecha: fechaStr,
                    estado: 'completado'
                }
            );
        }
        await Seguimiento.bulkCreate(seguimientosFabian);

        // --- MAURICIO: RACHA DE 15 DÍAS MÁXIMA ---
        console.log('📊 Creando datos para Mauricio (Racha máxima 15 días)...');
        const subMauricio = await UsuarioHabito.create({
            usuario_id: usuarios[2].id,
            habito_id: habitos[0].id,
            racha_actual: 5,
            racha_maxima: 15
        });

        const subMauricio2 = await UsuarioHabito.create({
            usuario_id: usuarios[2].id,
            habito_id: habitos[3].id,
            racha_actual: 5,
            racha_maxima: 15
        });

        // Últimos 5 días completados (racha actual)
        let seguimientosMauricio = [];
        for (let i = 0; i < 5; i++) {
            let fecha = new Date();
            fecha.setDate(hoy.getDate() - i);
            const fechaStr = fecha.toISOString().split('T')[0];
            seguimientosMauricio.push(
                {
                    usuario_habito_id: subMauricio.id,
                    fecha: fechaStr,
                    estado: 'completado'
                },
                {
                    usuario_habito_id: subMauricio2.id,
                    fecha: fechaStr,
                    estado: 'completado'
                }
            );
        }

        // Racha anterior de 15 días (hace 10 días)
        for (let i = 10; i < 25; i++) {
            let fecha = new Date();
            fecha.setDate(hoy.getDate() - i);
            const fechaStr = fecha.toISOString().split('T')[0];
            seguimientosMauricio.push(
                {
                    usuario_habito_id: subMauricio.id,
                    fecha: fechaStr,
                    estado: 'completado'
                },
                {
                    usuario_habito_id: subMauricio2.id,
                    fecha: fechaStr,
                    estado: 'completado'
                }
            );
        }
        await Seguimiento.bulkCreate(seguimientosMauricio);

        // --- CARLOS: RACHA DE 3 DÍAS (RECIÉN EMPEZÓ) ---
        console.log('📊 Creando datos para Carlos (Racha de 3 días)...');
        const subCarlos = await UsuarioHabito.create({
            usuario_id: usuarios[3].id,
            habito_id: habitos[2].id,
            racha_actual: 3,
            racha_maxima: 3
        });

        let seguimientosCarlos = [];
        for (let i = 0; i < 3; i++) {
            let fecha = new Date();
            fecha.setDate(hoy.getDate() - i);
            seguimientosCarlos.push({
                usuario_habito_id: subCarlos.id,
                fecha: fecha.toISOString().split('T')[0],
                estado: 'completado'
            });
        }
        await Seguimiento.bulkCreate(seguimientosCarlos);

        // --- ANA: RACHA DE 20 DÍAS ---
        console.log('📊 Creando datos para Ana (Racha de 20 días)...');
        const subAna = await UsuarioHabito.create({
            usuario_id: usuarios[4].id,
            habito_id: habitos[1].id,
            racha_actual: 20,
            racha_maxima: 20
        });

        const subAna2 = await UsuarioHabito.create({
            usuario_id: usuarios[4].id,
            habito_id: habitos[4].id,
            racha_actual: 20,
            racha_maxima: 20
        });

        let seguimientosAna = [];
        for (let i = 0; i < 20; i++) {
            let fecha = new Date();
            fecha.setDate(hoy.getDate() - i);
            const fechaStr = fecha.toISOString().split('T')[0];
            seguimientosAna.push(
                {
                    usuario_habito_id: subAna.id,
                    fecha: fechaStr,
                    estado: 'completado'
                },
                {
                    usuario_habito_id: subAna2.id,
                    fecha: fechaStr,
                    estado: 'completado'
                }
            );
        }
        await Seguimiento.bulkCreate(seguimientosAna);

        // --- LUIS: SIN RACHA (0 DÍAS) ---
        console.log('📊 Creando datos para Luis (Sin racha)...');
        const subLuis = await UsuarioHabito.create({
            usuario_id: usuarios[5].id,
            habito_id: habitos[0].id,
            racha_actual: 0,
            racha_maxima: 0
        });

        const subLuis2 = await UsuarioHabito.create({
            usuario_id: usuarios[5].id,
            habito_id: habitos[3].id,
            racha_actual: 0,
            racha_maxima: 0
        });

        // Luis tiene los hábitos pero nunca los ha completado
        await Seguimiento.bulkCreate([
            {
                usuario_habito_id: subLuis.id,
                fecha: hoy.toISOString().split('T')[0],
                estado: 'pendiente'
            },
            {
                usuario_habito_id: subLuis2.id,
                fecha: hoy.toISOString().split('T')[0],
                estado: 'pendiente'
            }
        ]);

        console.log('\n✅ ¡Seeder completado exitosamente!');
        console.log('\n👥 Usuarios creados:');
        console.log('   🔑 Admin    - Administrador del sistema');
        console.log('   1. Fabian   - Racha: 30 días (Perfecta) 🔥🔥🔥');
        console.log('   2. Mauricio - Racha: 5 días (Máxima: 15) 🔥');
        console.log('   3. Carlos   - Racha: 3 días (Recién empezó) 🌱');
        console.log('   4. Ana      - Racha: 20 días 🔥🔥');
        console.log('   5. Luis     - Racha: 0 días (Sin actividad) 💤');
        console.log('\n🔑 Contraseña para todos: password123');
        console.log('\n📧 Emails:');
        console.log('   - Admin: admin@awi.com');
        console.log('   - Usuarios: [nombre]@test.com');
        console.log('\n📊 Estadísticas de hábitos:');
        console.log('   - Fabian: 3 hábitos activos');
        console.log('   - Mauricio: 2 hábitos activos');
        console.log('   - Carlos: 1 hábito activo');
        console.log('   - Ana: 2 hábitos activos');
        console.log('   - Luis: 2 hábitos sin actividad');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error en el seeder:', error);
        process.exit(1);
    }
};

seed();
