import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg"></div>
            <Link to="/" className="text-2xl font-bold">
              Footre
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-blue-400 transition-colors">
              Accueil
            </Link>
            <Link to="/creativite" className="hover:text-blue-400 transition-colors">
              Créativité
            </Link>
            <Link to="/mes-creations" className="hover:text-blue-400 transition-colors">
              Mes Créations
            </Link>
          </nav>
          
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              Connexion
            </button>
            <Link to="/creativite">
              <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-lg transition-all">
                Nouvelle Création
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;