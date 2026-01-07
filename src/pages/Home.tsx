import React from 'react';
import { Link } from 'react-router-dom';
import { Creation } from '../types';

// Données d'exemple
const exampleCreations: Creation[] = [
  {
    id: '1',
    title: 'But en Or - Finale 2024',
    description: 'Un but spectaculaire généré par IA',
    imageUrl: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&auto=format&fit=crop',
    type: 'image',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Dribble Artistique',
    description: 'Mouvement de dribble en slow motion',
    imageUrl: 'https://images.unsplash.com/photo-1577223625818-75bc1f2ac0e5?w-800&auto=format&fit=crop',
    type: 'image',
    createdAt: '2024-01-14'
  },
  {
    id: '3',
    title: 'Celebration Épique',
    description: 'Célébration de but en équipe',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-group-of-friends-partying-happily-4640-large.mp4',
    type: 'video',
    createdAt: '2024-01-13'
  },
  {
    id: '4',
    title: 'Stade Lumineux',
    description: 'Stade sous les projecteurs nocturnes',
    imageUrl: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&auto=format&fit=crop',
    type: 'image',
    createdAt: '2024-01-12'
  },
];

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Créez l'<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
            Avenir du Football
          </span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Génerez des images et vidéos footballistiques uniques avec l'intelligence artificielle
        </p>
        <Link to="/creativite">
          <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-full text-xl font-semibold transition-all transform hover:scale-105">
            Commencer à créer
          </button>
        </Link>
      </section>

      {/* Gallery Section */}
      <section className="py-12 px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Créations Récents
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {exampleCreations.map((creation) => (
            <div 
              key={creation.id}
              className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
            >
              {creation.type === 'video' ? (
                <video 
                  className="w-full h-48 object-cover"
                  controls
                  src={creation.videoUrl}
                  poster={creation.imageUrl}
                />
              ) : (
                <img 
                  src={creation.imageUrl} 
                  alt={creation.title}
                  className="w-full h-48 object-cover"
                />
              )}
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-white">
                    {creation.title}
                  </h3>
                  <span className="text-xs px-2 py-1 bg-blue-900 text-blue-300 rounded-full">
                    {creation.type}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  {creation.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {new Date(creation.createdAt).toLocaleDateString()}
                  </span>
                  <button className="text-sm text-blue-400 hover:text-blue-300">
                    Voir plus →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/mes-creations">
            <button className="px-6 py-3 border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-colors">
              Voir toutes les créations
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;