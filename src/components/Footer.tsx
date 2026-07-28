import { MessageCircle, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { PHONE_DISPLAY, WHATSAPP_NUMBER } from "@/lib/constants.ts";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="font-black text-xl text-primary mb-2" style={{ fontFamily: "Cairo, sans-serif" }}>DARAK 3ANDNA</div>
          <p className="text-sm text-secondary-foreground/70 leading-relaxed">منصة عقارات الجزائر الأولى للبيع والشراء والإيجار في جميع الولايات</p>
          <div className="flex gap-3 mt-4">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer">
              <MessageCircle size={16} /> واتساب
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-primary mb-3">روابط سريعة</h4>
          <ul className="space-y-2 text-sm text-secondary-foreground/80">
            <li><Link to="/listings?operation=sale" className="hover:text-primary transition-colors cursor-pointer">عقارات للبيع</Link></li>
            <li><Link to="/listings?operation=rent" className="hover:text-primary transition-colors cursor-pointer">عقارات للإيجار</Link></li>
            <li><Link to="/listings?type=land" className="hover:text-primary transition-colors cursor-pointer">أراضي</Link></li>
            <li><Link to="/listings?type=commercial" className="hover:text-primary transition-colors cursor-pointer">محلات تجارية</Link></li>
            <li><Link to="/add-listing" className="hover:text-primary transition-colors cursor-pointer">أضف إعلانك مجاناً</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-primary mb-3">تواصل معنا</h4>
          <ul className="space-y-3 text-sm text-secondary-foreground/80">
            <li className="flex items-center gap-2"><Phone size={15} className="text-primary" /><a href={`tel:${WHATSAPP_NUMBER}`} className="hover:text-primary transition-colors">{PHONE_DISPLAY}</a></li>
            <li className="flex items-center gap-2"><MessageCircle size={15} className="text-primary" /><a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors cursor-pointer">واتساب: {PHONE_DISPLAY}</a></li>
            <li className="flex items-center gap-2"><MapPin size={15} className="text-primary" /><span>الجزائر</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-secondary-foreground/50">
        © {new Date().getFullYear()} دارك عندنا DZ — جميع الحقوق محفوظة
      </div>
    </footer>
  );
}
