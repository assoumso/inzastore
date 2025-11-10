import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminAuthProps {
  children: React.ReactNode;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Mot de passe admin (dans un vrai projet, cela devrait être géré côté serveur)
  const ADMIN_PASSWORD = 'inzastore2024';
  const AUTH_SESSION_KEY = 'inzastore_admin_auth';

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà authentifié
    const isAuth = sessionStorage.getItem(AUTH_SESSION_KEY) === 'true';
    setIsAuthenticated(isAuth);
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
      setIsAuthenticated(true);
    } else {
      setError('Mot de passe incorrect');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    setIsAuthenticated(false);
    setPassword('');
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Vérification de l'authentification...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center px-4">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Admin INZASTORE</h1>
            <p className="text-gray-300">Accès restreint au tableau de bord administrateur</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Mot de passe administrateur
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Entrez le mot de passe admin"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-3">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Se connecter
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-gray-300 hover:text-white text-sm transition-colors duration-300"
            >
              ← Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Barre de navigation admin */}
      <div className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold">Tableau de bord Admin</h2>
            <span className="text-green-400 text-sm">● Connecté</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
          >
            Déconnexion
          </button>
        </div>
      </div>

      {/* Contenu admin protégé */}
      <div className="container mx-auto p-6">
        {children}
      </div>
    </div>
  );
};

export default AdminAuth;