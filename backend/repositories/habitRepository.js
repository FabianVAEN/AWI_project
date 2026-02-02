class HabitRepository {
    constructor() {
        // Catálogo de hábitos predeterminados
        this.habitosDefault = [
            { id: 1, nombre: 'Beber 8 vasos de agua', descripcion: 'Mantener hidratación adecuada durante el día' },
            { id: 2, nombre: 'Hacer ejercicio 30 min', descripcion: 'Actividad física diaria para mantener la salud' },
            { id: 3, nombre: 'Dormir 8 horas', descripcion: 'Descanso adecuado para recuperación' },
            { id: 4, nombre: 'Meditar 10 minutos', descripcion: 'Práctica de mindfulness y relajación' },
            { id: 5, nombre: 'Comer 5 porciones de frutas/verduras', descripcion: 'Nutrición balanceada' },
            { id: 6, nombre: 'Leer 20 páginas', descripcion: 'Estimulación mental y aprendizaje' },
            { id: 7, nombre: 'Caminar 10,000 pasos', descripcion: 'Actividad física continua' },
            { id: 8, nombre: 'Desconectar dispositivos 1 hora antes de dormir', descripcion: 'Mejor calidad de sueño' },
            { id: 9, nombre: 'Practicar gratitud', descripcion: 'Escribir 3 cosas por las que estás agradecido' },
            { id: 10, nombre: 'Estiramientos matutinos', descripcion: 'Activar el cuerpo al comenzar el día' }
        ];

        // Lista de hábitos del usuario (en memoria)
        this.listaHabitos = [];
        this.nextId = 1;
    }

    // Obtener catálogo
    findAllDefaults() {
        return this.habitosDefault;
    }

    findDefaultById(id) {
        return this.habitosDefault.find(h => h.id === id);
    }

    // Obtener lista del usuario
    findUserHabits() {
        return this.listaHabitos;
    }

    findUserHabitById(id) {
        return this.listaHabitos.find(h => h.id === id);
    }

    findUserHabitByDefaultId(habito_id) {
        return this.listaHabitos.find(h => h.habito_id === habito_id);
    }

    // Agregar a la lista
    create(habitData) {
    const newHabit = {
        id: this.nextId++,
        estado: 'por hacer', // Mantener como predeterminado
        agregado_at: new Date().toISOString(),
        ...habitData
    };
    this.listaHabitos.push(newHabit);
    return newHabit;
    }

    // Actualizar hábito
    update(id, data) {
        const index = this.listaHabitos.findIndex(h => h.id === id);
        if (index === -1) return null;

        this.listaHabitos[index] = {
            ...this.listaHabitos[index],
            ...data,
            id // Asegurar que el ID no cambie
        };
        return this.listaHabitos[index];
    }

    // Eliminar hábito
    delete(id) {
        const index = this.listaHabitos.findIndex(h => h.id === id);
        if (index === -1) return null;

        return this.listaHabitos.splice(index, 1)[0];
    }
}

module.exports = new HabitRepository();