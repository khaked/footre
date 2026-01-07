import React from 'react';
import { Creation } from '../types';

// Données d'exemple
const userCreations: Creation[] = [
  {
    id: '1',
    title: 'Mon Premier But',
    description: 'Créé le 15 janvier 2024',
    imageUrl: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&auto=format&fit=crop',
    type: 'image',
    createdAt: '2024-01-15',
    prompt: 'Un joueur marquant un but en pleine extension'
  },
  {
    id: '2',
    title: 'Dribble Magique',
    description: 'Créé le 14 janvier 2024',
    imageUrl: 'https://images.unsplash.com/photo-1577223625818-75bc1f2ac0e5?w=800&auto=format&fit=crop',
    type: 'image',
    createdAt: '2024-01-14',
    prompt: 'Dribble artistique en slow motion'
  },
  {
    id: '3',
    title: 'Celebration d\'Équipe',
    description: 'Créé le 13 janvier 2024',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-group-of-friends-partying-happily-4640-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1577223625818-75bc1f2ac0e5?w=800&auto=format&fit=crop', // Ajouté
    type: 'video',
    createdAt: '2024-01-13',
    prompt: 'Équipe célébrant une victoire importante'
  },
];

const MesCreations: React.FC = () => {
  const [creations] = React.useState<Creation[]>(userCreations);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Mes Créations
          </h1>
          <p className="text-gray-300">
            Retrouvez ici toutes vos créations générées avec l'IA
          </p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="px-4 py-2 bg-blue-900 text-blue-300 rounded-full">
              {creations.length} créations
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-lg transition-all">
              Trier par date
            </button>
          </div>
        </div>

        {/* Grille des créations */}
        {creations.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creations.map((creation) => (
                <div 
                  key={creation.id}
                  className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 group"
                >
                  {/* Media */}
                  <div className="relative">
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
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 rounded-full text-xs text-white">
                      {creation.type}
                    </div>
                  </div>
                  
                  {/* Contenu */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {creation.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">
                      {creation.description}
                    </p>
                    
                    {creation.prompt && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Prompt utilisé:</p>
                        <p className="text-gray-300 text-sm italic line-clamp-2">
                          "{creation.prompt}"
                        </p>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {new Date(creation.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex space-x-2">
                        <button className="text-sm text-blue-400 hover:text-blue-300 px-3 py-1 hover:bg-blue-900/30 rounded-lg transition-colors">
                          Télécharger
                        </button>
                        <button className="text-sm text-red-400 hover:text-red-300 px-3 py-1 hover:bg-red-900/30 rounded-lg transition-colors">
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600">
                   Précédent
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                  1
                </button>
                <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600">
                  2
                </button>
                <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600">
                  3
                </button>
                <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600">
                  Suivant 
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-gray-400 text-6xl mb-4"></div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Aucune création pour le moment
            </h3>
            <p className="text-gray-400 mb-8">
              Commencez par créer votre première œuvre avec l'IA
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-full text-lg font-semibold transition-all">
              Créer maintenant
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MesCreations;
