import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [habitos, setHabitos] = useState([]);
  const [listaHabitos, setListaHabitos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Pantalla de carga por 3 segundos
    const timer = setTimeout(() => {
      setLoading(false);
      cargarDatos();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const cargarDatos = async () => {
    try {
      const [habitosRes, listaRes] = await Promise.all([
        fetch(`${API_URL}/habitos`),
        fetch(`${API_URL}/lista-habitos`)
      ]);

      if (!habitosRes.ok || !listaRes.ok) {
        throw new Error('Error al cargar datos');
      }

      const habitosData = await habitosRes.json();
      const listaData = await listaRes.json();

      setHabitos(habitosData);
      setListaHabitos(listaData);
    } catch (err) {
      setError('Error de conexión. Verifica que el servidor esté corriendo.');
      console.error(err);
    }
  };

  const agregarHabito = async (habitoId) => {
    try {
      const res = await fetch(`${API_URL}/lista-habitos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habito_id: habitoId })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      await cargarDatos();
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      const res = await fetch(`${API_URL}/lista-habitos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (!res.ok) throw new Error('Error al actualizar');

      await cargarDatos();
    } catch (err) {
      setError('Error al actualizar estado');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-8xl font-bold text-white mb-4 animate-pulse">AWI</h1>
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-100"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  const habitosYaAgregados = listaHabitos.map(h => h.nombre);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 mb-2">
            Bienvenido a AWI
          </h1>
          <p className="text-gray-600 text-lg">Construye hábitos saludables y sostenibles</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Hábitos disponibles */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Hábitos Disponibles
          </h2>
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max px-4">
              {habitos.map((habito) => {
                const yaAgregado = habitosYaAgregados.includes(habito.nombre);
                return (
                  <button
                    key={habito.id}
                    onClick={() => !yaAgregado && agregarHabito(habito.id)}
                    disabled={yaAgregado}
                    className={`flex-shrink-0 w-64 p-6 rounded-xl shadow-lg transition-all transform hover:scale-105 ${
                      yaAgregado
                        ? 'bg-gray-300 cursor-not-allowed opacity-60'
                        : 'bg-gradient-to-br from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 cursor-pointer'
                    }`}
                  >
                    <h3 className="text-white font-bold text-lg mb-2">
                      {habito.nombre}
                    </h3>
                    <p className="text-white text-sm opacity-90">
                      {habito.descripcion}
                    </p>
                    {yaAgregado && (
                      <span className="inline-block mt-3 px-3 py-1 bg-white text-gray-700 text-xs rounded-full">
                        ✓ Agregado
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lista de hábitos del usuario */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Mi Lista de Hábitos
          </h2>
          
          {listaHabitos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                Tu lista está vacía. Agrega hábitos desde arriba para comenzar.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {listaHabitos.map((habito) => (
                <div
                  key={habito.id}
                  className={`p-5 rounded-lg border-2 transition-all ${
                    habito.estado === 'hecho'
                      ? 'bg-green-50 border-green-300'
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold ${
                        habito.estado === 'hecho' ? 'line-through text-gray-500' : 'text-gray-800'
                      }`}>
                        {habito.nombre}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {habito.descripcion}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => cambiarEstado(
                          habito.id,
                          habito.estado === 'por hacer' ? 'hecho' : 'por hacer'
                        )}
                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                          habito.estado === 'hecho'
                            ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        {habito.estado === 'hecho' ? 'Desmarcar' : 'Completar'}
                      </button>
                      
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        habito.estado === 'hecho'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {habito.estado === 'hecho' ? '✓ Hecho' : '○ Por hacer'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/*footer*/}
          <div className="mt-8 text-center text-gray-400 text-sm">
            &copy; 2026 AWI. Todos los derechos reservados.</div>
        </div>
      </div>
    </div>
  );
}