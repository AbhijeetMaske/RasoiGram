import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Plus, 
  Trash2, 
  Camera, 
  AlertCircle,
  Tag,
  Clock
} from 'lucide-react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';

interface Ingredient {
  id: string;
  name: string;
  category: string;
  addedAt: any;
  expiryDate?: string;
}

export default function Inventory() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItemName, setNewItemName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Vegetables');

  const categories = ['Vegetables', 'Dairy', 'Grains', 'Spices', 'Snacks', 'Proteins', 'Others'];

  useEffect(() => {
    if (!auth.currentUser) return;
    
    const inventoryRef = collection(db, 'users', auth.currentUser.uid, 'inventory');
    const q = query(inventoryRef, orderBy('addedAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as Ingredient[];
      setIngredients(items);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${auth.currentUser?.uid}/inventory`);
    });

    return () => unsubscribe();
  }, []);

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !auth.currentUser) return;

    try {
      await addDoc(collection(db, 'users', auth.currentUser.uid, 'inventory'), {
        name: newItemName,
        category: selectedCategory,
        addedAt: serverTimestamp()
      });
      setNewItemName('');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `users/${auth.currentUser?.uid}/inventory`);
    }
  };

  const removeItem = async (id: string) => {
    if (!auth.currentUser) return;
    try {
      await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'inventory', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `users/${auth.currentUser?.uid}/inventory/${id}`);
    }
  };

  return (
    <div className="p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif font-black text-stone-900 mb-2">Digital Pantry</h1>
          <p className="text-stone-500 text-sm font-medium">Tracking {ingredients.length} items in your rasoi</p>
        </div>
        <button className="p-4 rounded-2xl bg-saffron text-white shadow-lg shadow-saffron/20 hover:scale-105 transition-transform">
          <Camera size={24} />
        </button>
      </header>

      {/* Add Item Bar */}
      <form onSubmit={addItem} className="flex flex-col md:flex-row gap-3 mb-10">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input 
            type="text" 
            placeholder="Add ginger, garlic, potato..." 
            className="w-full h-14 pl-12 pr-4 bg-white border border-stone-100 focus:border-saffron focus:ring-4 focus:ring-saffron/10 rounded-2xl transition-all outline-none shadow-sm"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
        </div>
        <select 
          className="h-14 px-4 bg-white border border-stone-100 rounded-2xl outline-none shadow-sm font-bold text-stone-600 text-sm"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button className="h-14 px-8 bg-stone-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors shadow-lg">
          <Plus size={20} /> Add Item
        </button>
      </form>

      {/* Inventory List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center text-stone-400">Loading your pantry...</div>
        ) : ingredients.length === 0 ? (
          <div className="py-20 text-center bg-stone-50 rounded-[2rem] border-2 border-dashed border-stone-200">
            <p className="text-stone-400">Your rasoi is empty. Start adding items or use AI scan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ingredients.map(item => (
              <motion.div 
                layout
                key={item.id} 
                className="glass-card p-5 rounded-3xl flex justify-between items-center group overflow-hidden"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getCategoryColor(item.category)}`}>
                    <Tag size={20} className="text-white/60" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-800">{item.name}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-stone-400 mt-1 uppercase tracking-wider font-bold">
                      <span>{item.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock size={10} /> Fresh</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all lg:opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    'Vegetables': 'bg-earth-green',
    'Dairy': 'bg-blue-400',
    'Grains': 'bg-turmeric',
    'Spices': 'bg-spice-red',
    'Snacks': 'bg-saffron',
    'Proteins': 'bg-stone-700',
    'Others': 'bg-stone-400'
  };
  return colors[category] || colors['Others'];
}
