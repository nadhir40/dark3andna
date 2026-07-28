import { Home, Building2, Landmark, Store, MapPin, Phone, MessageCircle, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { PHONE_DISPLAY, WHATSAPP_NUMBER } from "@/lib/constants.ts";
import { useQuery, Authenticated } from "convex/react";
import { api } from "@/convex/_generated/api.js";

function AdminLink() {
  const user = useQuery(api.users.getCurrentUser);
  if (!user?.isAdmin) return null;
  return (
    <Link to="/admin" className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer text-yellow-400">
      <LayoutDashboard size={16} />
      لوحة التحكم
    </Link>
  );
}

export default function Navbar() {
  return (
    <header className="bg-secondary text-secondary-foreground sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <img src="https://hercules-cdn.com/file_K6jibpYkVZcIcrauC6aLYKVW" alt="دارك عندنا" className="h-10 w-10 rounded-full object-cover" />
          <div className="leading-tight">
            <div className="font-black text-lg text-primary tracking-wide" style={{ fontFamily: "Cairo, sans-serif" }}>DARAK 3ANDNA</div>
            <div className="text-xs text-secondary-foreground/70">دارك عندنا | الجزائر</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-5 text-sm font-semibold">
          <Link to="/listings?operation=sale" className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"><Home size={15} /> للبيع</Link>
          <Link to="/listings?operation=rent" className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"><Building2 size={15} /> للإيجار</Link>
          <Link to="/listings?type=land" className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"><Landmark size={15} /> أراضي</Link>
          <Link to="/listings?type=commercial" className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"><Store size={15} /> تجاري</Link>
          <Link to="/listings" className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"><MapPin size={15} /> كل الولايات</Link>
          <Authenticated><AdminLink /></Authenticated>
        </nav>
        <div className="flex items-center gap-3">
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors cursor-pointer">
            <Phone size={15} />{PHONE_DISPLAY}
          </a>
          <Link to="/add-listing" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors cursor-pointer">
            + أضف إعلانك
          </Link>
        </div>
      </div>
      <div className="md:hidden border-t border-white/10 px-4 py-2 flex items-center justify-between text-xs font-semibold overflow-x-auto gap-4">
        <Link to="/listings?operation=sale" className="flex items-center gap-1 whitespace-nowrap hover:text-primary cursor-pointer"><Home size={14} /> للبيع</Link>
        <Link to="/listings?operation=rent" className="flex items-center gap-1 whitespace-nowrap hover:text-primary cursor-pointer"><Building2 size={14} /> للإيجار</Link>
        <Link to="/listings?type=land" className="flex items-center gap-1 whitespace-nowrap hover:text-primary cursor-pointer"><Landmark size={14} /> أراضي</Link>
        <Link to="/listings?type=commercial" className="flex items-center gap-1 whitespace-nowrap hover:text-primary cursor-pointer"><Store size={14} /> تجاري</Link>
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 whitespace-nowrap text-primary cursor-pointer"><MessageCircle size={14} /> واتساب</a>
        <Authenticated>
          <Link to="/admin" className="flex items-center gap-1 whitespace-nowrap text-yellow-400 cursor-pointer"><LayoutDashboard size={14} /> تحكم</Link>
        </Authenticated>
      </div>
    </header>
  );
}
