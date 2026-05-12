import { 
  Plus, 
  UtensilsCrossed, 
  ChefHat, 
  User, 
  ScanLine,
  Search,
  Home
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { User as FirebaseUser } from 'firebase/auth';

interface NavbarProps {
  user: FirebaseUser | null;
  openAuth: () => void;
}

export default function Navbar({ user, openAuth }: NavbarProps) {
  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 z-50 md:hidden">
        <div className="flex justify-around items-center h-16">
          <NavItem to="/dashboard" icon={<Home size={24} />} label="Home" />
          <NavItem to="/inventory" icon={<UtensilsCrossed size={24} />} label="Pantry" />
          <NavItem to="/recipes" icon={<ChefHat size={24} />} label="AI Chef" />
          <NavItem to="/profile" icon={<User size={24} />} label="Profile" />
        </div>
      </nav>

      {/* Desktop Top Nav */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-white border-b border-orange-100 items-center justify-between px-8 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-saffron rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded-full"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-saffron">RasoiGram</span>
        </div>

        <div className="flex items-center gap-8 text-sm font-medium text-stone-600">
          <DesktopNavItem to="/dashboard" label="Dashboard" />
          <DesktopNavItem to="/inventory" label="My Pantry" />
          <DesktopNavItem to="/recipes" label="AI Assistant" />
          
          <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100 text-saffron text-xs">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            AI Assistant Active
          </div>

          {!user ? (
            <button 
              onClick={openAuth}
              className="bg-saffron text-white px-5 py-2 rounded-full text-xs font-bold shadow-lg shadow-saffron/20 hover:brightness-110 transition-all"
            >
              Sign In
            </button>
          ) : (
            <NavLink to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} alt="User" className="w-8 h-8 rounded-full border border-stone-100" />
              <span className="text-xs font-bold text-stone-800 hidden lg:block">{user.displayName || 'Chef'}</span>
            </NavLink>
          )}
        </div>
      </nav>
    </>
  );
}

function NavItem({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex flex-col items-center gap-1 px-4 py-2 transition-colors ${isActive ? 'text-saffron' : 'text-stone-400'}`
      }
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
    </NavLink>
  );
}

function DesktopNavItem({ to, label }: { to: string, label: string }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `transition-colors ${isActive ? 'text-saffron font-bold' : 'text-stone-400 hover:text-stone-800'}`
      }
    >
      {label}
    </NavLink>
  );
}
