import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg"></div>
              <h3 className="text-xl font-bold">Footre</h3>
            </div>
            <p className="text-gray-400">
              Créez des contenus footballistiques uniques avec l'IA
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white">Accueil</a></li>
              <li><a href="/creativite" className="hover:text-white">Créativité</a></li>
              <li><a href="/mes-creations" className="hover:text-white">Mes Créations</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Légal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Mentions légales</a></li>
              <li><a href="#" className="hover:text-white">Confidentialité</a></li>
              <li><a href="#" className="hover:text-white">CGU</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Footre. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;