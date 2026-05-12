import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ChevronRight, 
  Utensils, 
  Flame, 
  Calendar,
  Zap
} from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, limit, onSnapshot, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({ inventory: 0, recipes: 0 });
  const [recentRecipes, setRecentRecipes] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) return;

    // Inventory count
    const invUnsubscribe = onSnapshot(collection(db, 'users', auth.currentUser.uid, 'inventory'), (snap) => {
      setStats(prev => ({ ...prev, inventory: snap.size }));
    }, (err) => handleFirestoreError(err, OperationType.LIST, `users/${auth.currentUser?.uid}/inventory`));

    // History
    const histRef = collection(db, 'users', auth.currentUser.uid, 'history');
    const q = query(histRef, orderBy('generatedAt', 'desc'), limit(3));
    const histUnsubscribe = onSnapshot(q, (snap) => {
      setStats(prev => ({ ...prev, recipes: snap.size }));
      setRecentRecipes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, `users/${auth.currentUser?.uid}/history`));

    return () => {
      invUnsubscribe();
      histUnsubscribe();
    };
  }, []);

  return (
    <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in duration-500">
      {/* Left Sidebar: Digital Pantry (Desktop Only) */}
      <aside className="hidden md:flex col-span-3 flex-col gap-6 overflow-hidden">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-50 flex-1 overflow-hidden">
          <h3 className="text-xs font-black uppercase tracking-widest text-saffron mb-6">Digital Pantry</h3>
          <div className="space-y-4">
            <PantryItem emoji="🍅" name="Tomatoes" detail="Fresh • 4 units" />
            <PantryItem emoji="🥛" name="Amul Milk" detail="Expires Today" urgent />
            <PantryItem emoji="🥬" name="Spinach" detail="Organic • 1 bunch" />
            <PantryItem emoji="🧀" name="Paneer" detail="200g • Cold" />
          </div>
          <button 
            onClick={() => navigate('/inventory')}
            className="w-full mt-6 py-4 bg-white border-2 border-dashed border-orange-100 rounded-2xl text-saffron text-xs font-bold hover:bg-orange-50 transition-colors uppercase tracking-widest"
          >
            + View Full Rasoi
          </button>
        </div>

        <div className="bg-saffron rounded-3xl p-6 text-white flex flex-col justify-between shadow-lg shadow-saffron/20">
          <div>
            <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mb-1">Family Health</p>
            <h4 className="text-xl font-serif font-bold italic">Weight Loss Mode</h4>
          </div>
          <div className="mt-6 flex gap-2">
            <MacroCard label="Prot" value="85g" />
            <MacroCard label="Carb" value="120g" />
            <MacroCard label="Kcal" value="1650" />
          </div>
        </div>
      </aside>

      {/* Center Section: Main Assistant */}
      <section className="col-span-1 md:col-span-6 flex flex-col gap-6">
        <header className="mb-4 md:hidden">
          <h1 className="text-3xl font-serif font-black text-stone-900 leading-tight">
            Namaste, {auth.currentUser?.displayName?.split(' ')[0] || 'Chef'}!
          </h1>
        </header>

        <div className="relative flex-1 bg-white rounded-[3rem] shadow-2xl border-[1px] border-orange-50 overflow-hidden min-h-[500px]">
          {/* Subtle Phone Notch for Aesthetic */}
          <div className="hidden md:flex absolute top-0 w-full h-8 bg-white justify-center items-end">
            <div className="w-24 h-4 bg-stone-100 rounded-b-2xl"></div>
          </div>

          <div className="p-8 pt-10 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-serif font-black italic">Rasoi<span className="text-saffron">Gram</span></h2>
              <button className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-saffron hover:scale-110 transition-transform">
                <Sparkles size={24} />
              </button>
            </div>

            <div className="bg-stone-50 p-6 rounded-[2.5rem] border border-orange-50 mb-8 relative group cursor-pointer hover:shadow-xl transition-all" onClick={() => navigate('/recipes')}>
              <div className="flex justify-between items-start mb-3">
                <span className="px-2 py-1 bg-green-100 text-green-700 text-[9px] font-black rounded uppercase tracking-wider">AI Recommendation</span>
                <span className="text-xs text-stone-400 font-bold">20 Mins</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-800 leading-tight">Quick Garlic Spinach Paneer</h3>
              <p className="text-sm text-stone-500 mt-2 font-medium">Using ingredients from your morning scan.</p>
              
              <div className="flex -space-x-2 mt-6">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-orange-100" />
                ))}
                <div className="h-8 pl-4 flex items-center">
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">+ 4 more</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1">
              <NavCard icon="📅" label="Meal Plan" onClick={() => {}} />
              <NavCard icon="🛒" label="Groceries" onClick={() => {}} />
              <NavCard icon="📸" label="Scan Fridge" onClick={() => navigate('/inventory')} />
              <NavCard icon="💎" label="Premium" onClick={() => {}} />
            </div>
          </div>
        </div>
      </section>

      {/* Right Sidebar: Weekly Planner (Desktop Only) */}
      <aside className="hidden md:flex col-span-3 flex-col gap-6 overflow-hidden">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-50 flex-1 flex flex-col">
          <h3 className="text-xs font-black uppercase tracking-widest text-saffron mb-6">Weekly Meal Planner</h3>
          <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            <PlanItem day="MONDAY" meal="BREAKFAST" dish="Poha with Sprouts" active />
            <PlanItem day="MONDAY" meal="LUNCH" dish="Dal Tadka & Brown Rice" />
            <PlanItem day="MONDAY" meal="DINNER" dish="Oats Khichdi" />
            
            <div className="mt-8 pt-8 border-t border-stone-100">
               <h4 className="text-xs font-black mb-4 uppercase tracking-widest text-stone-400">Missing for Tomorrow</h4>
               <MissingItem name="Fresh Coriander" />
               <MissingItem name="Whole Wheat Flour" />
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-stone-100 flex gap-2">
            <PartnerButton label="zepto" color="bg-blue-50" />
            <PartnerButton label="blinkit" color="bg-yellow-50" />
          </div>
        </div>

        <div className="bg-green-700 rounded-3xl p-6 text-white shadow-xl shadow-green-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl shrink-0">🥘</div>
          <div>
            <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mb-1">Chef's Tip</p>
            <p className="text-xs leading-relaxed font-medium">Add a pinch of Kasuri Methi for an instant aroma boost.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}

function PantryItem({ emoji, name, detail, urgent }: { emoji: string, name: string, detail: string, urgent?: boolean }) {
  return (
    <div className={`p-4 rounded-2xl flex items-center gap-4 border ${urgent ? 'bg-red-50 border-red-100' : 'bg-stone-50 border-stone-100'}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${urgent ? 'bg-white shadow-sm' : 'bg-orange-50'}`}>{emoji}</div>
      <div className="flex-1">
        <p className={`text-sm font-bold ${urgent ? 'text-red-900' : 'text-stone-800'}`}>{name}</p>
        <p className={`text-[10px] font-medium ${urgent ? 'text-red-500 italic' : 'text-stone-400'}`}>{detail}</p>
      </div>
    </div>
  );
}

function MacroCard({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex-1 bg-white/10 p-2 rounded-xl text-center border border-white/10 backdrop-blur-sm">
      <p className="text-[10px] uppercase font-bold opacity-70 mb-0.5">{label}</p>
      <p className="font-bold text-sm">{value}</p>
    </div>
  );
}

function NavCard({ icon, label, onClick }: { icon: string, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center border border-stone-100 shadow-sm hover:shadow-xl hover:scale-105 transition-all group"
    >
      <div className="text-3xl mb-3 group-hover:scale-125 transition-transform">{icon}</div>
      <p className="text-xs font-black uppercase tracking-widest text-stone-800">{label}</p>
    </button>
  );
}

function PlanItem({ day, meal, dish, active }: { day: string, meal: string, dish: string, active?: boolean }) {
  return (
    <div className="relative pl-6 border-l-2 border-stone-100 pb-4 last:pb-0">
      <div className={`absolute -left-[5px] top-0 w-2 h-2 rounded-full ${active ? 'bg-saffron ring-4 ring-saffron/20' : 'bg-stone-300'}`}></div>
      <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">{day} • {meal}</p>
      <p className={`text-sm font-bold ${active ? 'text-saffron' : 'text-stone-800'}`}>{dish}</p>
    </div>
  );
}

function MissingItem({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="w-1.5 h-1.5 rounded-full bg-saffron"></div>
      <p className="text-xs flex-1 text-stone-600 font-medium">{name}</p>
      <button className="text-[10px] font-black text-saffron uppercase border-b border-saffron/20 pb-0.5">Add</button>
    </div>
  );
}

function PartnerButton({ label, color }: { label: string, color: string }) {
  return (
    <button className={`flex-1 h-12 ${color} rounded-xl flex items-center justify-center px-4 hover:brightness-95 transition-all shadow-sm`}>
      <span className="text-xs font-black italic tracking-tighter italic uppercase text-stone-900/50">{label}</span>
    </button>
  );
}

function StatCard({ label, value, icon, onClick }: { label: string, value: number, icon: React.ReactNode, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="glass-card p-6 rounded-3xl text-left hover:scale-[1.02] transition-transform"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center">
          {icon}
        </div>
      </div>
      <p className="text-3xl font-black text-stone-900 leading-none mb-1">{value}</p>
      <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">{label}</p>
    </button>
  );
}
