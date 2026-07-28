import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import {
  MapPin, BedDouble, Maximize2, Bath, Layers, Phone, MessageCircle,
  ArrowRight, Eye, Share2, Home, ChevronLeft, ChevronRight
} from "lucide-react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { getPropertyTypeLabel, getOperationLabel, formatPrice } from "@/lib/listing-utils.ts";
import { toast } from "sonner";

const FALLBACK = "https://images.unsplash.com/photo-1651009793956-6684bba370f3?w=800&q=80";

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const listing = useQuery(api.listings.getListing, { id: id as Id<"listings"> });
  const incrementViews = useMutation(api.listings.incrementViews);
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    if (listing?._id) {
      incrementViews({ id: listing._id }).catch(() => null);
    }
  }, [listing?._id]);

  const handleShare = async () => {
    try {
      await navigator.share({ title: listing?.title, url: window.location.href });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("تم نسخ رابط الإعلان");
    }
  };

  if (listing === undefined) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8 w-full space-y-4">
          <Skeleton className="h-72 rounded-xl w-full" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Footer />
      </div>
    );
  }

  if (listing === null) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
          <Home size={48} className="text-muted-foreground opacity-30" />
          <h2 className="text-xl font-bold">الإعلان غير موجود</h2>
          <p className="text-muted-foreground">ربما تم حذفه أو الرابط خاطئ</p>
          <Button onClick={() => navigate("/listings")}>العودة للقائمة</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const images = listing.imageUrls.length > 0 ? listing.imageUrls : [FALLBACK];
  const whatsappMsg = encodeURIComponent(`مرحباً، أنا مهتم بإعلانك: ${listing.title} على موقع دارك عندنا\n${window.location.href}`);
  const whatsappUrl = `https://wa.me/${listing.contactPhone.replace(/\D/g, "")}?text=${whatsappMsg}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6 w-full flex-1">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary cursor-pointer">الرئيسية</Link>
          <ArrowRight size={12} />
          <Link to="/listings" className="hover:text-primary cursor-pointer">الإعلانات</Link>
          <ArrowRight size={12} />
          <span className="text-foreground truncate max-w-[200px]">{listing.title}</span>
        </div>

        {/* Image gallery */}
        <div className="relative rounded-2xl overflow-hidden mb-5 bg-muted">
          <img src={images[currentImg]} alt={listing.title} className="w-full h-64 md:h-96 object-cover" />

          {images.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImg((p) => (p === 0 ? images.length - 1 : p - 1))}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 cursor-pointer transition-colors"
              >
                <ChevronRight size={20} />
              </button>
              <button
                onClick={() => setCurrentImg((p) => (p === images.length - 1 ? 0 : p + 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 cursor-pointer transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button key={i} onClick={() => setCurrentImg(i)}
                    className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${i === currentImg ? "bg-white" : "bg-white/50"}`} />
                ))}
              </div>
            </>
          )}

          <div className="absolute top-3 right-3 flex gap-1.5">
            <Badge className={listing.operation === "sale" ? "bg-primary text-primary-foreground font-bold" : "bg-blue-600 text-white font-bold"}>
              {getOperationLabel(listing.operation)}
            </Badge>
            {listing.featured && <Badge className="bg-yellow-500 text-black font-bold">مميز</Badge>}
          </div>

          <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            <Eye size={12} /> {listing.views ?? 0}
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-8 right-3 flex gap-1">
              {images.slice(0, 5).map((src, i) => (
                <button key={i} onClick={() => setCurrentImg(i)}
                  className={`w-10 h-10 rounded overflow-hidden border-2 cursor-pointer transition-all ${i === currentImg ? "border-primary" : "border-white/30"}`}>
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main info */}
          <div className="md:col-span-2 space-y-5">
            <div>
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-xl md:text-2xl font-black text-foreground leading-snug">{listing.title}</h1>
                <button onClick={handleShare} className="text-muted-foreground hover:text-primary transition-colors cursor-pointer shrink-0 mt-1" title="مشاركة">
                  <Share2 size={20} />
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1.5">
                <MapPin size={14} className="text-primary" />
                {listing.wilaya}{listing.commune ? ` — ${listing.commune}` : ""}
              </div>
            </div>

            {/* Price */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl px-5 py-4">
              <div className="text-2xl font-black text-primary">
                {formatPrice(listing.price, listing.priceUnit)}
                {listing.operation === "rent" && listing.rentPeriod && (
                  <span className="text-sm font-normal text-muted-foreground mr-1">
                    / {listing.rentPeriod === "monthly" ? "شهر" : "سنة"}
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {getPropertyTypeLabel(listing.type)} — {getOperationLabel(listing.operation)}
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {listing.area != null && (
                <div className="bg-card border border-border rounded-xl p-3 text-center">
                  <Maximize2 size={20} className="mx-auto text-primary mb-1" />
                  <div className="font-bold text-sm">{listing.area} م²</div>
                  <div className="text-xs text-muted-foreground">المساحة</div>
                </div>
              )}
              {listing.rooms != null && (
                <div className="bg-card border border-border rounded-xl p-3 text-center">
                  <BedDouble size={20} className="mx-auto text-primary mb-1" />
                  <div className="font-bold text-sm">{listing.rooms}</div>
                  <div className="text-xs text-muted-foreground">غرف</div>
                </div>
              )}
              {listing.bathrooms != null && (
                <div className="bg-card border border-border rounded-xl p-3 text-center">
                  <Bath size={20} className="mx-auto text-primary mb-1" />
                  <div className="font-bold text-sm">{listing.bathrooms}</div>
                  <div className="text-xs text-muted-foreground">حمامات</div>
                </div>
              )}
              {listing.floor != null && (
                <div className="bg-card border border-border rounded-xl p-3 text-center">
                  <Layers size={20} className="mx-auto text-primary mb-1" />
                  <div className="font-bold text-sm">ط {listing.floor}</div>
                  <div className="text-xs text-muted-foreground">الطابق</div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="font-bold text-base mb-3">الوصف</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{listing.description}</p>
            </div>
          </div>

          {/* Contact card */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-5 sticky top-20">
              <h2 className="font-bold text-base mb-4">التواصل مع المعلن</h2>
              <div className="flex items-center gap-3 mb-5 p-3 bg-muted rounded-lg">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="font-black text-primary text-lg">{listing.contactName.charAt(0)}</span>
                </div>
                <div>
                  <div className="font-semibold text-sm">{listing.contactName}</div>
                  <div className="text-xs text-muted-foreground">{listing.contactPhone}</div>
                </div>
              </div>
              <div className="space-y-3">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer">
                  <MessageCircle size={18} /> تواصل عبر واتساب
                </a>
                <a href={`tel:${listing.contactPhone}`}
                  className="flex items-center justify-center gap-2 w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 font-bold py-3 rounded-xl transition-colors cursor-pointer">
                  <Phone size={18} /> اتصل الآن
                </a>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-4">تحقق من العقار قبل الدفع</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
