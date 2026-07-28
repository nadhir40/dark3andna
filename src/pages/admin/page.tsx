import { useState } from "react";
import { useQuery, useMutation, Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import {
  CheckCircle, XCircle, Trash2, Eye, Star, StarOff,
  Clock, LayoutDashboard, ListFilter, Users, BarChart3,
  ChevronDown, ChevronUp, MessageCircle
} from "lucide-react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import Navbar from "@/components/Navbar.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { toast } from "sonner";
import { getPropertyTypeLabel, getOperationLabel, formatPrice } from "@/lib/listing-utils.ts";

const FALLBACK = "https://images.unsplash.com/photo-1651009793956-6684bba370f3?w=200&q=60";
type Tab = "pending" | "all";

function AdminContent() {
  const [tab, setTab] = useState<Tab>("pending");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const currentUser = useQuery(api.users.getCurrentUser);
  const pendingListings = useQuery(api.listings.getPendingListings);
  const allListings = useQuery(api.listings.getAllListingsAdmin);
  const updateStatus = useMutation(api.listings.updateListingStatus);
  const deleteListing = useMutation(api.listings.deleteListing);
  const toggleFeatured = useMutation(api.listings.toggleFeatured);

  if (currentUser === undefined) {
    return <div className="p-8 space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>;
  }

  if (!currentUser?.isAdmin) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
        <LayoutDashboard size={48} className="text-muted-foreground opacity-30" />
        <h2 className="text-xl font-black">غير مصرح لك</h2>
        <p className="text-muted-foreground text-sm">هذه الصفحة مخصصة للمشرفين فقط</p>
      </div>
    );
  }

  const listings = tab === "pending" ? pendingListings : allListings;
  const isLoading = listings === undefined;
  const pendingCount = pendingListings?.length ?? 0;
  const totalCount = allListings?.length ?? 0;
  const approvedCount = allListings?.filter((l) => l.status === "approved").length ?? 0;

  const handleApprove = async (id: Id<"listings">) => {
    try { await updateStatus({ id, status: "approved" }); toast.success("تم قبول الإعلان ونشره"); }
    catch { toast.error("حدث خطأ"); }
  };
  const handleReject = async (id: Id<"listings">) => {
    try { await updateStatus({ id, status: "rejected" }); toast.success("تم رفض الإعلان"); }
    catch { toast.error("حدث خطأ"); }
  };
  const handleDelete = async (id: Id<"listings">) => {
    if (!confirm("هل أنت متأكد من حذف هذا الإعلان نهائياً؟")) return;
    try { await deleteListing({ id }); toast.success("تم حذف الإعلان"); }
    catch { toast.error("حدث خطأ"); }
  };
  const handleToggleFeatured = async (id: Id<"listings">, featured: boolean) => {
    try { await toggleFeatured({ id, featured: !featured }); toast.success(!featured ? "تم تمييز الإعلان" : "تم إلغاء التمييز"); }
    catch { toast.error("حدث خطأ"); }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 w-full flex-1">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { icon: Clock, label: "قيد المراجعة", value: pendingCount, color: "text-yellow-500" },
          { icon: CheckCircle, label: "منشورة", value: approvedCount, color: "text-green-500" },
          { icon: BarChart3, label: "إجمالي الإعلانات", value: totalCount, color: "text-primary" },
          { icon: Users, label: "مرحباً", value: currentUser.name ?? "مشرف", color: "text-blue-500" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4">
            <Icon size={20} className={`mb-2 ${color}`} />
            <div className="font-black text-lg text-foreground">{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        <button onClick={() => setTab("pending")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer ${tab === "pending" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:bg-muted"}`}>
          <Clock size={15} /> قيد المراجعة
          {pendingCount > 0 && <span className="bg-yellow-500 text-black text-xs px-1.5 py-0.5 rounded-full font-black">{pendingCount}</span>}
        </button>
        <button onClick={() => setTab("all")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer ${tab === "all" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:bg-muted"}`}>
          <ListFilter size={15} /> كل الإعلانات
        </button>
      </div>

      {/* Listings */}
      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
      ) : listings?.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <CheckCircle size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">{tab === "pending" ? "لا توجد إعلانات قيد المراجعة" : "لا توجد إعلانات بعد"}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {listings?.map((listing) => {
            const isExpanded = expandedId === listing._id;
            const mainImg = listing.imageUrls[0] ?? FALLBACK;
            return (
              <div key={listing._id} className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="flex items-center gap-3 p-3">
                  <img src={mainImg} alt={listing.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm text-foreground truncate">{listing.title}</h3>
                      <Badge className={
                        listing.status === "approved" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs" :
                        listing.status === "rejected" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 text-xs" :
                        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs"
                      }>
                        {listing.status === "approved" ? "منشور" : listing.status === "rejected" ? "مرفوض" : "قيد المراجعة"}
                      </Badge>
                      {listing.featured && <Badge className="bg-yellow-400 text-black text-xs">مميز</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {listing.wilaya} — {getPropertyTypeLabel(listing.type)} — {getOperationLabel(listing.operation)}
                    </div>
                    <div className="text-xs font-bold text-primary mt-0.5">{formatPrice(listing.price, listing.priceUnit)}</div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {listing.status === "pending" && (
                      <>
                        <button onClick={() => handleApprove(listing._id)} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors cursor-pointer" title="قبول"><CheckCircle size={16} /></button>
                        <button onClick={() => handleReject(listing._id)} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors cursor-pointer" title="رفض"><XCircle size={16} /></button>
                      </>
                    )}
                    {listing.status === "approved" && (
                      <button onClick={() => handleToggleFeatured(listing._id, listing.featured ?? false)}
                        className={`p-2 rounded-lg transition-colors cursor-pointer ${listing.featured ? "bg-yellow-400 text-black hover:bg-yellow-500" : "bg-muted text-muted-foreground hover:bg-yellow-100 hover:text-yellow-600"}`}
                        title={listing.featured ? "إلغاء التمييز" : "تمييز الإعلان"}>
                        {listing.featured ? <StarOff size={16} /> : <Star size={16} />}
                      </button>
                    )}
                    {listing.status === "rejected" && (
                      <button onClick={() => handleApprove(listing._id)} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors cursor-pointer text-xs font-bold px-3">نشر</button>
                    )}
                    <button onClick={() => handleDelete(listing._id)} className="bg-destructive/10 hover:bg-destructive hover:text-white text-destructive p-2 rounded-lg transition-colors cursor-pointer" title="حذف"><Trash2 size={16} /></button>
                    <button onClick={() => setExpandedId(isExpanded ? null : listing._id)} className="bg-muted hover:bg-muted/70 text-muted-foreground p-2 rounded-lg transition-colors cursor-pointer">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-border p-4 bg-muted/30 space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div><span className="text-muted-foreground">المعلن:</span><span className="font-semibold mr-1">{listing.contactName}</span></div>
                      <div><span className="text-muted-foreground">الهاتف:</span><span className="font-semibold mr-1" dir="ltr">{listing.contactPhone}</span></div>
                      <div><span className="text-muted-foreground">المشاهدات:</span><span className="font-semibold mr-1">{listing.views ?? 0}</span></div>
                      <div><span className="text-muted-foreground">الصور:</span><span className="font-semibold mr-1">{listing.imageUrls.length}</span></div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed border-t border-border pt-3">{listing.description}</p>
                    {listing.imageUrls.length > 0 && (
                      <div className="flex gap-2 flex-wrap pt-1">
                        {listing.imageUrls.map((url, i) => <img key={i} src={url} alt="" className="w-20 h-20 rounded-lg object-cover" />)}
                      </div>
                    )}
                    <div className="flex gap-2 pt-1">
                      <a href={`https://wa.me/${listing.contactPhone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-green-700 transition-colors cursor-pointer">
                        <MessageCircle size={13} /> تواصل مع المعلن
                      </a>
                      <a href={`/listings/${listing._id}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs bg-muted text-foreground px-3 py-1.5 rounded-lg font-semibold hover:bg-muted/70 transition-colors cursor-pointer">
                        <Eye size={13} /> عرض الإعلان
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-4 w-full">
        <div className="flex items-center gap-2 mb-1">
          <LayoutDashboard size={20} className="text-primary" />
          <h1 className="text-lg font-black text-foreground">لوحة تحكم المشرف</h1>
        </div>
        <p className="text-xs text-muted-foreground mb-5">إدارة الإعلانات العقارية — دارك عندنا DZ</p>
      </div>
      <AuthLoading>
        <div className="max-w-5xl mx-auto px-4 w-full space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      </AuthLoading>
      <Unauthenticated>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
          <LayoutDashboard size={48} className="text-muted-foreground opacity-30" />
          <h2 className="text-xl font-black">يجب تسجيل الدخول</h2>
          <p className="text-muted-foreground text-sm">لوحة التحكم مخصصة للمشرفين فقط</p>
          <SignInButton />
        </div>
      </Unauthenticated>
      <Authenticated>
        <AdminContent />
      </Authenticated>
    </div>
  );
}
