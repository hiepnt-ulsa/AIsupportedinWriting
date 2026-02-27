import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Sparkles, 
  Download, 
  RefreshCw, 
  Wand2, 
  Loader2,
  Send
} from 'lucide-react';
import { ImageUpload } from './components/ImageUpload';
import { StyleSelector } from './components/StyleSelector';
import { generateHeadshot, editHeadshot, HeadshotStyle } from './services/gemini';

export default function App() {
  const [step, setStep] = useState<1 | 2>(1);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<HeadshotStyle | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!sourceImage || !selectedStyle) return;

    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateHeadshot(sourceImage, selectedStyle.prompt);
      setResultImage(result);
      setStep(2);
      // Wait for animation then scroll
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
      setError("Failed to generate headshot. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = async () => {
    if (!resultImage || !editPrompt.trim()) return;

    setIsEditing(true);
    setError(null);
    try {
      const result = await editHeadshot(resultImage, editPrompt);
      setResultImage(result);
      setEditPrompt('');
    } catch (err) {
      console.error(err);
      setError("Failed to edit image. Please try again.");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `headshot-${selectedStyle?.id || 'professional'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setSourceImage(null);
    setSelectedStyle(null);
    setResultImage(null);
    setStep(1);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-900 tracking-tight">AI Headshot Studio</span>
          </div>
          
          {step === 2 && (
            <button 
              onClick={reset}
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Start Over
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-5 space-y-8">
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">1</div>
                <h2 className="font-semibold text-slate-900">Upload your selfie</h2>
              </div>
              <ImageUpload 
                onImageSelect={setSourceImage} 
                selectedImage={sourceImage} 
              />
            </section>

            <section className={!sourceImage ? 'opacity-50 pointer-events-none' : ''}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">2</div>
                <h2 className="font-semibold text-slate-900">Choose a style</h2>
              </div>
              <StyleSelector 
                selectedStyleId={selectedStyle?.id || null} 
                onStyleSelect={setSelectedStyle} 
              />
            </section>

            <button
              onClick={handleGenerate}
              disabled={!sourceImage || !selectedStyle || isGenerating}
              className={`
                w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all
                ${!sourceImage || !selectedStyle || isGenerating
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-[0.98]'
                }
              `}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Headshot
                </>
              )}
            </button>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Right Column: Result */}
          <div className="lg:col-span-7" ref={resultRef}>
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div 
                  key="placeholder"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-white/50"
                >
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                    <Wand2 className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Your AI Headshot will appear here</h3>
                  <p className="text-slate-500 max-w-xs mx-auto">
                    Upload a photo and select a style to see the magic happen.
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="relative group rounded-3xl overflow-hidden shadow-2xl bg-white border border-slate-200 aspect-[4/5]">
                    {isGenerating ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm z-10">
                        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                        <p className="font-medium text-slate-600">Perfecting your headshot...</p>
                      </div>
                    ) : null}
                    
                    {resultImage && (
                      <img 
                        src={resultImage} 
                        alt="Generated Headshot" 
                        className="w-full h-full object-cover"
                      />
                    )}

                    <div className="absolute top-4 right-4 flex gap-2">
                      <button 
                        onClick={handleDownload}
                        className="p-3 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg text-slate-700 transition-all active:scale-90"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                      <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-medium flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-yellow-400" />
                        AI Generated • {selectedStyle?.name}
                      </div>
                    </div>
                  </div>

                  {/* AI Editing Feature */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-2">
                      <Wand2 className="w-5 h-5 text-indigo-600" />
                      <h3 className="font-bold text-slate-900">Refine with AI</h3>
                    </div>
                    <p className="text-sm text-slate-500">
                      Want to change something? Try "Add a blue tie", "Make the lighting warmer", or "Change background to a park".
                    </p>
                    <div className="relative">
                      <input
                        type="text"
                        value={editPrompt}
                        onChange={(e) => setEditPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
                        placeholder="Describe your edit..."
                        className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      />
                      <button
                        onClick={handleEdit}
                        disabled={isEditing || !editPrompt.trim()}
                        className={`
                          absolute right-2 top-1.5 p-2 rounded-xl transition-all
                          ${isEditing || !editPrompt.trim()
                            ? 'text-slate-300'
                            : 'text-indigo-600 hover:bg-indigo-50'
                          }
                        `}
                      >
                        {isEditing ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="max-w-5xl mx-auto px-4 mt-20 text-center text-slate-400 text-sm">
        <p>© 2026 AI Headshot Studio. Powered by Gemini 2.5 Flash Image.</p>
      </footer>
    </div>
  );
}
