import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Smartphone, Zap, Sparkles } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex flex-col items-center justify-center text-center p-6 bg-premium-cream overflow-hidden">
        {/* Background Decorative Elements from Design */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-turmeric/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-saffron rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border border-orange-100">
            <Sparkles size={14} className="animate-pulse" /> AI Assistant Active
          </div>
          <h1 className="text-5xl md:text-8xl font-serif font-black text-stone-900 leading-none mb-6">
            Rasoi<span className="text-saffron">Gram</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-500 max-w-lg mx-auto mb-10 leading-relaxed font-medium">
            Intelligent meal planning for the modern Indian home. Scan your fridge, save on groceries, and cook healthy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/dashboard')}
              className="h-14 px-10 bg-saffron text-white rounded-2xl font-bold shadow-xl shadow-saffron/20 hover:scale-105 transition-transform"
            >
              Get Started
            </button>
            <button className="h-14 px-10 bg-white text-stone-800 rounded-2xl font-bold shadow-sm hover:bg-stone-50 transition-colors border border-orange-50">
              Watch Demo
            </button>
          </div>
        </motion.div>

        {/* Floating Mockup/Image */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 40 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="absolute bottom-0 translate-y-1/2 w-full max-w-2xl px-6"
        >
           <div className="aspect-[16/9] bg-stone-900 rounded-t-[2rem] shadow-2xl relative overflow-hidden p-1">
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1585932231552-29877a5fa44c?q=80&w=2070&auto=format&fit=crop" 
                alt="Indian Food" 
                className="w-full h-full object-cover rounded-t-[1.8rem]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-4 left-6 z-20">
                 <p className="text-white font-serif text-2xl">Paneer Butter Masala</p>
                 <p className="text-white/60 text-sm">Ready from your inventory in 20 mins</p>
              </div>
           </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-white z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Smartphone className="text-saffron" size={32} />}
              title="Fridge Scanning"
              description="Upload a photo of your fridge and let Gemini Vision detect ingredients instantly."
            />
            <FeatureCard 
              icon={<ChefHat className="text-saffron" size={32} />}
              title="Regional Expertise"
              description="Authentic Maharashtrian, Punjabi, South Indian recipes customized to your pantry."
            />
            <FeatureCard 
              icon={<Zap className="text-saffron" size={32} />}
              title="Smart Grocery"
              description="Never forget a spice. RasoiGram auto-generates missing item lists."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl bg-stone-50 border border-stone-100 hover:shadow-xl transition-all group">
      <div className="mb-6 p-4 bg-white rounded-2xl w-fit shadow-sm group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-serif font-bold mb-3 text-stone-800">{title}</h3>
      <p className="text-stone-500 leading-relaxed">{description}</p>
    </div>
  );
}
