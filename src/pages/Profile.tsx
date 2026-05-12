import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Settings, 
  Heart, 
  LogOut, 
  Target,
  Shield,
  Bell
} from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="p-6 md:p-12 animate-in fade-in duration-500">
      <div className="max-w-xl mx-auto">
        <header className="text-center mb-12">
          <div className="relative inline-block">
             <img 
               src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} 
               className="w-32 h-32 rounded-[2.5rem] p-2 bg-white shadow-2xl border-2 border-stone-100"
               alt="User Profile"
             />
             <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-saffron rounded-xl flex items-center justify-center text-white border-4 border-white">
                <Settings size={18} />
             </div>
          </div>
          <h1 className="text-3xl font-serif font-black text-stone-900 mt-6">{user?.displayName || 'Rasoi Chef'}</h1>
          <p className="text-stone-500 font-medium">{user?.email}</p>
        </header>

        <div className="space-y-6">
           <ProfileSection title="Preferences">
             <PreferenceRow icon={<Heart className="text-spice-red" />} label="Dietary Preference" value="Vegetarian" />
             <PreferenceRow icon={<Target className="text-earth-green" />} label="Health Goals" value="Muscle Gain" />
             <PreferenceRow icon={<Shield className="text-blue-500" />} label="Allergies" value="Nuts, Gluten" />
           </ProfileSection>

           <ProfileSection title="Account">
             <button className="w-full flex items-center justify-between p-4 hover:bg-stone-50 transition-colors rounded-2xl group">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center text-stone-500 group-hover:bg-saffron group-hover:text-white transition-all">
                    <Bell size={18} />
                  </div>
                  <span className="font-bold text-stone-700">Notifications</span>
               </div>
               <div className="w-12 h-6 bg-stone-200 rounded-full flex items-center px-1">
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
               </div>
             </button>

             <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-4 p-4 hover:bg-red-50 text-red-600 transition-colors rounded-2xl group"
             >
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                  <LogOut size={18} />
                </div>
                <span className="font-bold">Sign Out</span>
             </button>
           </ProfileSection>
        </div>

        <p className="mt-12 text-center text-[10px] font-bold text-stone-300 uppercase tracking-widest">
          RasoiGram v1.0.0 Alpha
        </p>
      </div>
    </div>
  );
}

function ProfileSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div>
      <h3 className="px-4 text-xs font-black text-stone-400 uppercase tracking-widest mb-3">{title}</h3>
      <div className="bg-white rounded-[2rem] border border-stone-100 shadow-sm overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function PreferenceRow({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-stone-50 last:border-0 hover:bg-stone-50 transition-colors">
       <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center">
            {icon}
          </div>
          <span className="font-bold text-stone-700">{label}</span>
       </div>
       <span className="text-stone-400 text-sm">{value}</span>
    </div>
  );
}
