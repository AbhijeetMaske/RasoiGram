import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ChefHat, 
  Scale, 
  Clock, 
  Zap, 
  History,
  AlertCircle,
  CheckCircle2,
  ListRestart
} from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { GoogleGenAI, Type } from '@google/genai';
import { RASOI_RECIPE_SCHEMA, generateRecipePrompt } from '../lib/gemini';
import ReactMarkdown from 'react-markdown';
import confetti from 'canvas-confetti';

export default function RecipeAI() {
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateRecipe = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    setError(null);
    setRecipe(null);

    try {
      // 1. Fetch inventory
      const invRef = collection(db, 'users', auth.currentUser.uid, 'inventory');
      let invSnap;
      try {
        invSnap = await getDocs(invRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, `users/${auth.currentUser.uid}/inventory`);
        return;
      }
      const ingredients = invSnap.docs.map(d => d.data().name);

      if (ingredients.length === 0) {
        throw new Error("Your rasoi is empty! Please add some ingredients in the Pantry tab first.");
      }

      // 2. Setup Gemini
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: generateRecipePrompt(ingredients, { cuisine: "Healthy Indian", diet: "General" }),
        config: {
          responseMimeType: "application/json",
          responseSchema: RASOI_RECIPE_SCHEMA as any,
        }
      });

      const data = JSON.parse(response.text);
      setRecipe(data);

      // 3. Save to history
      try {
        await addDoc(collection(db, 'users', auth.currentUser.uid, 'history'), {
          ...data,
          generatedAt: serverTimestamp()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `users/${auth.currentUser.uid}/history`);
      }

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF9933', '#FFCC33', '#4F7942']
      });

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-12">
      <header className="mb-10 text-center">
        <div className="w-16 h-16 indian-gradient rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-saffron/20 translate-y-1">
          <ChefHat size={32} />
        </div>
        <h1 className="text-3xl font-serif font-black text-stone-900 mb-2">AI Recipe Laboratory</h1>
        <p className="text-stone-500">I'll create a masterpiece using whatever you have.</p>
      </header>

      {!recipe && !loading && (
        <div className="max-w-md mx-auto text-center py-20">
           <Zap className="mx-auto text-saffron/20 mb-8" size={80} />
           <p className="text-stone-400 mb-10">Select your mode and I'll start the magic.</p>
           
           <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={generateRecipe}
                className="p-8 rounded-[2rem] bg-white border-2 border-stone-100 hover:border-saffron hover:shadow-2xl transition-all group text-left relative overflow-hidden"
              >
                  <div className="flex justify-between items-center z-10 relative">
                    <div>
                      <h3 className="font-serif font-black text-xl text-stone-800">Quick Indian Meal</h3>
                      <p className="text-sm text-stone-500">Using current inventory</p>
                    </div>
                    <Sparkles className="text-saffron group-hover:scale-125 transition-transform" />
                  </div>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-saffron/5 group-hover:bg-saffron/10 rounded-full blur-2xl transition-all" />
              </button>
           </div>
        </div>
      )}

      {loading && (
        <div className="max-w-md mx-auto text-center py-20">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-24 h-24 bg-saffron/10 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-dashed border-saffron/30"
          >
            <ChefHat className="text-saffron" size={40} />
          </motion.div>
          <p className="text-stone-900 font-serif font-bold text-xl mb-2">Simmering your recipe...</p>
          <p className="text-stone-400 text-sm">Mixing authentic Indian spices & logic</p>
        </div>
      )}

      {error && (
        <div className="max-w-md mx-auto p-6 bg-red-50 border border-red-100 rounded-3xl flex items-start gap-4 mb-10">
          <AlertCircle className="text-red-500 shrink-0 mt-1" />
          <div>
             <p className="text-red-900 font-bold">Chef's Blocker</p>
             <p className="text-red-700/80 text-sm leading-relaxed">{error}</p>
             <button onClick={generateRecipe} className="mt-4 text-red-900 font-bold text-sm underline">Retry generation</button>
          </div>
        </div>
      )}

      {recipe && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="glass-card rounded-[3rem] overflow-hidden mb-10">
             <div className="h-64 relative bg-stone-900">
                <img 
                  src={`https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop`} 
                  alt="Delicious Food" 
                  className="w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <span className="px-3 py-1 bg-saffron text-white text-[10px] font-bold uppercase tracking-widest rounded-full">{recipe.cuisine}</span>
                  <h2 className="text-3xl md:text-5xl font-serif font-black text-white mt-3 leading-tight">{recipe.title}</h2>
                </div>
             </div>

             <div className="p-8 md:p-12">
                <div className="flex flex-wrap gap-8 mb-12 py-6 border-y border-stone-100">
                   <RecipeMeta icon={<Clock size={16} />} label="Prep" value={recipe.prepTime} />
                   <RecipeMeta icon={<Flame size={16} />} label="Cook" value={recipe.cookTime} />
                   <RecipeMeta icon={<Scale size={16} />} label="Effort" value={recipe.difficulty} />
                   <RecipeMeta icon={<Zap size={16} />} label="Kcal" value={recipe.nutrition?.calories || 320} />
                </div>

                <p className="text-lg text-stone-600 font-medium italic mb-12 leading-relaxed">
                  "{recipe.description}"
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div>
                      <h4 className="font-serif font-black text-2xl mb-6 text-stone-900 flex items-center gap-3">
                        <Utensils className="text-saffron" size={24} /> Ingredients
                      </h4>
                      <ul className="space-y-4">
                        {recipe.ingredients.map((ing: any, i: number) => (
                          <li key={i} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                            <span className="text-stone-800 font-medium">{ing.item}</span>
                            <span className="text-stone-400 font-bold text-xs">{ing.amount}</span>
                            {ing.isAvailable === false && (
                              <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-black uppercase">Missing</span>
                            )}
                          </li>
                        ))}
                      </ul>
                   </div>

                   <div>
                      <h4 className="font-serif font-black text-2xl mb-6 text-stone-900 flex items-center gap-3">
                        <CheckCircle2 className="text-earth-green" size={24} /> Step-by-Step
                      </h4>
                      <div className="space-y-6 relative">
                        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-stone-100" />
                        {recipe.instructions.map((step: string, i: number) => (
                          <div key={i} className="relative pl-10">
                            <div className="absolute left-0 w-8 h-8 rounded-full bg-white border-2 border-stone-200 flex items-center justify-center font-bold text-xs text-stone-400 z-10 group-hover:border-saffron">
                              {i+1}
                            </div>
                            <p className="text-stone-600 leading-relaxed pt-1">{step}</p>
                          </div>
                        ))}
                      </div>
                   </div>
                </div>

                <div className="mt-12 pt-12 border-t border-stone-100 flex gap-4">
                   <button 
                    onClick={() => { setRecipe(null); generateRecipe(); }}
                    className="flex-1 h-14 bg-stone-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-stone-800 transition-all"
                   >
                     <ListRestart size={20} /> Generate Another
                   </button>
                   <button className="h-14 px-8 border-2 border-stone-100 rounded-2xl font-bold hover:bg-stone-50 transition-all">Save to Plan</button>
                </div>
             </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function RecipeMeta({ icon, label, value }: { icon: any, label: string, value: string | number }) {
  return (
    <div className="flex items-center gap-3">
       <div className="w-8 h-8 rounded-lg bg-premium-cream flex items-center justify-center text-saffron">
         {icon}
       </div>
       <div>
         <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{label}</p>
         <p className="text-sm font-black text-stone-800">{value}</p>
       </div>
    </div>
  );
}
