'use client';
import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

export function LoginModal({ isOpen, onClose, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const endpoint = isRegistering ? 'register' : 'login';
      const response = await fetch(`https://localhost:7279/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password
        }),
      });


    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Error en la autenticación');
    }

    if (data.token) {
      localStorage.setItem('token', data.token);
      onLogin(data.token);
      onClose();
    } else {
      throw new Error('No se recibió el token');
    }
  } catch (error) {
    setError(error.message || 'Error en la autenticación');
    console.error('Error completo:', error);
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full relative animate-fadeIn">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          disabled={isLoading}
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
        </h2>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 transition-all duration-200"
              required
              placeholder="Ingrese su usuario"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 transition-all duration-200"
                required
                placeholder="Ingrese su contraseña"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              type="submit"
              className={`w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium flex items-center justify-center
                ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="inline-block animate-spin mr-2">⭕</span>
              ) : null}
              {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </button>

            <button
              type="button"
              className="text-blue-500 hover:text-blue-600 text-sm text-center hover:underline transition-colors duration-200"
              onClick={() => {
                if (!isLoading) {
                  setError('');
                  setIsRegistering(!isRegistering);
                }
              }}
              disabled={isLoading}
            >
              {isRegistering 
                ? '¿Ya tienes cuenta? Inicia sesión' 
                : '¿No tienes cuenta? Regístrate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}