import React, { useState } from 'react';

import { replicate } from '../utils/replicate';
// ou gardez openai pour compatibilité

const Creativite: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState<'image' | 'video'>('image');
  const [style, setStyle] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{url: string; revised_prompt: string} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      alert('Veuillez entrer une description');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      let response;
      if (type === 'image') {
        response = await replicate.generateImage(prompt, style);
      } 
      
      setResult(response);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const styles = [
    { value: '', label: 'Réaliste' },
    { value: 'artistic', label: 'Artistique' },
    { value: 'cartoon', label: 'Dessin animé' },
    { value: '3d-render', label: 'Rendu 3D' },
    { value: 'oil-painting', label: 'Peinture à l\'huile' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Titre */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Créativité avec l'IA
          </h1>
          <p className="text-gray-300">
            Générez des images et vidéos footballistiques uniques grâce à l'intelligence artificielle
          </p>
        </div>

        {/* Formulaire de création */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type de création */}
            <div>
              <label className="block text-white mb-3 font-medium">
                Type de création
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setType('image')}
                  className={`flex-1 py-3 rounded-lg transition-all ${
                    type === 'image' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  🖼️ Image
                </button>
                <button
                  type="button"
                  onClick={() => setType('video')}
                  className={`flex-1 py-3 rounded-lg transition-all ${
                    type === 'video' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  🎬 Vidéo
                </button>
              </div>
            </div>

            {/* Style (seulement pour les images) */}
            {type === 'image' && (
              <div>
                <label className="block text-white mb-3 font-medium">
                  Style artistique
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {styles.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setStyle(s.value)}
                      className={`py-2 rounded-lg transition-all ${
                        style === s.value 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Prompt */}
            <div>
              <label className="block text-white mb-3 font-medium">
                Décrivez votre création
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Exemple: Un joueur de football marquant un but spectaculaire en finale de Coupe du Monde, stade comble, lumière dramatique..."
                className="w-full h-32 bg-gray-700 text-white rounded-lg p-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-gray-400 text-sm mt-2">
                Soyez le plus descriptif possible pour de meilleurs résultats
              </p>
            </div>

            {/* Bouton de génération */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
                loading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 hover:scale-105'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Génération en cours...
                </div>
              ) : (
                '🎨 Générer la création'
              )}
            </button>
          </form>
        </div>

        {/* Résultat */}
        {result && (
          <div className="bg-gray-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Votre création est prête !
            </h2>
            
            <div className="mb-6">
              {type === 'image' ? (
                <img 
                  src={result.url} 
                  alt="Generated"
                  className="w-full max-w-2xl mx-auto rounded-lg shadow-2xl"
                />
              ) : (
                <video 
                  src={result.url} 
                  controls
                  className="w-full max-w-2xl mx-auto rounded-lg shadow-2xl"
                />
              )}
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="text-white font-medium mb-2">Prompt utilisé:</h3>
              <p className="text-gray-300 italic">{result.revised_prompt}</p>
            </div>

            <div className="flex justify-center space-x-4 mt-6">
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white">
                Télécharger
              </button>
              <button className="px-6 py-3 border-2 border-green-500 text-green-400 hover:bg-green-500 hover:text-white rounded-lg transition-colors">
                Enregistrer dans mes créations
              </button>
              <button 
                onClick={() => setResult(null)}
                className="px-6 py-3 border-2 border-gray-600 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Créer autre chose
              </button>
            </div>
          </div>
        )}

        {/* Exemples */}
        {!result && !loading && (
          <div className="mt-12">
            <h3 className="text-xl font-bold text-white mb-4">Exemples de prompts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => {
                  setPrompt("Une équipe de football célébrant une victoire en finale, stade illuminé, feux d'artifice");
                  setType('image');
                }}
              >
                <p className="text-gray-300 italic">"Une équipe célébrant une victoire en finale, stade illuminé, feux d'artifice"</p>
              </div>
              <div 
                className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => {
                  setPrompt("Un joueur effectuant un dribble technique contre trois défenseurs, mouvement fluide, style cartoon");
                  setType('image');
                  setStyle('cartoon');
                }}
              >
                <p className="text-gray-300 italic">"Un dribble technique contre trois défenseurs, mouvement fluide, style cartoon"</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Creativite;