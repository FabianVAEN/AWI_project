import React from 'react';
import { Button, Input, Card } from './index';

/**
 * Componente HabitForm reutilizable para crear y editar hábitos
 * 
 * Props:
 * - mode: 'create' | 'edit' (default: 'create')
 * - initialData: { nombre: '', descripcion: '' }
 * - onSubmit: function(formData)
 * - onCancel: function()
 * - isSubmitting: boolean
 * - title: string (título del formulario)
 */
export default function HabitForm({
  mode = 'create',
  initialData = { nombre: '', descripcion: '' },
  onSubmit,
  onCancel,
  isSubmitting = false,
  title = mode === 'create' ? 'Crear Hábito' : 'Editar Hábito'
}) {
  const [formData, setFormData] = React.useState(initialData);
  const [error, setError] = React.useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Limpiar error al escribir
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre.trim()) {
      setError('El nombre del hábito es obligatorio');
      return;
    }

    onSubmit(formData);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre del Hábito"
          name="nombre"
          placeholder="Ej: Meditar 20 minutos"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        
        <Input
          label="Descripción"
          name="descripcion"
          placeholder="Ej: Práctica diaria de meditación"
          type="textarea"
          value={formData.descripcion}
          onChange={handleChange}
        />

        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            variant="success"
            type="submit"
            isLoading={isSubmitting}
          >
            {mode === 'create' ? 'Crear Hábito' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </Card>
  );
}