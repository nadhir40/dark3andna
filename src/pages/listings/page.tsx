import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { usePaginatedQuery } from "convex/react";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { api } from "@/convex/_generated/api.js";
import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";
import ListingCard from "@/components/ListingCard.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Button } from "@/components/ui/button.tsx";
import { WILAYAS } from "@/lib/constants.ts";
import {
  Empty, EmptyHeader, EmptyMedia, EmptyTitle,
  EmptyDescription, EmptyContent,
} from "@/components/ui/empty.tsx";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

type Operation = "sale" | "rent" | "";
type PropertyType = "apartment" | "house" | "land" | "commercial" | "villa" | "";

const TYPE_LABELS: Record<string, string> = {
  apartment: "شقة", house: "منزل", land: "أرض",
  commercial: "محل تجاري", villa: "فيلا",
};

export default function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [wilaya, setWilaya] = useState(searchParams.get("wilaya") ?? "");
  const [operation, setOperation] = useState<Operation>((searchParams.get("operation") as Operation) ?? "");
  const [type, setType] = useState<PropertyType>((searchParams.get("type") as PropertyType) ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");

  useEffect(() => {
    const p: Record<string, string> = {};
    if (wilaya) p.wilaya = wilaya;
    if (operation) p.operation = operation;
    if (type) p.type = type;
    if (minPrice) p.minPrice = minPrice;
    if (maxPrice) p.maxPrice = maxPrice;
    setSearchParams(p, { replace: true });
  }, [wilaya, operation, type, minPrice, maxPrice, setSearchParams]);

  const { results, status, loadMore } = usePaginatedQuery(
    api.listings.getApprovedListings,
    {
      wilaya: wilaya || undefined,
      operation: (operation as "sale" | "rent") || undefined,
      type: (type as "apartment" | "house" | "land" | "commercial" | "villa") || undefined,
    },
    { initialNumItems: 12 }
  );

  const filtered = results.filter((l) => {
    if (minPrice && l.price < Number(minPrice)) return false;
    if (maxPrice && l.price > Number(maxPrice)) return false;
    return true;
  });

  const activeFilterCount = [wilaya, operation, type, minPrice, maxPrice].filter(Boolean).length;

  const clearFilters = () => {
    setWilaya(""); setOperation(""); setType(""); setMinPrice(""); setMaxPrice("");
  };

  const isLoading = status === "LoadingFirstPage";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto w-full px-4 py-6 flex-1">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-black text-foreground">
              {operation === "sale" && "عقارات للبيع"}
              {operation === "rent" && "عقارات للإيجار"}
              {!operation && "كل الإعلانات"}
              {type && ` — ${TYPE_LABELS[type] ?? type}`}
              {wilaya && ` في ${wilaya}`}
            </h1>
            {!isLoading && (
              <p className="text-sm text-muted-foreground mt-0.5">{filtered.length} نتيجة</p>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 border border-border rounded-lg px-3 py-2 text-sm font-semibold hover:bg-muted transition-colors cursor-pointer relative"
          >
            <SlidersHorizontal size={16} />
            تصفية
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-card border border-border rounded-xl p-4 mb-5 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">العملية</label>
                <select value={operation} onChange={(e) => setOperation(e.target.value as Operation)}
                  className="w-full bg-background border border-border rounded-lg px-2 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
                  <option value="">الكل</option>
                  <option value="sale">للبيع</option>
                  <option value="rent">للإيجار</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">النوع</label>
                <select value={type} onChange={(e) => setType(e.target.value as PropertyType)}
                  className="w-full bg-background border border-border rounded-lg px-2 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
                  <option value="">الكل</option>
                  <option value="apartment">شقة</option>
                  <option value="house">منزل</option>
                  <option value="villa">فيلا</option>
                  <option value="land">أرض</option>
                  <option value="commercial">محل تجاري</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">الولاية</label>
                <select value={wilaya} onChange={(e) => setWilaya(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-2 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
                  <option value="">كل الولايات</option>
                  {WILAYAS.map((w) => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">السعر الأدنى (دج)</label>
                <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="مثال: 500000" min={0}
                  className="w-full bg-background border border-border rounded-lg px-2 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">السعر الأعلى (دج)</label>
                <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="مثال: 5000000" min={0}
                  className="w-full bg-background border border-border rounded-lg px-2 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-destructive hover:underline cursor-pointer">
                <X size={14} /> مسح كل الفلاتر
              </button>
            )}
          </div>
        )}

        {/* Active filter chips */}
        {activeFilterCount > 0 && !showFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            {operation && (
              <span className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-semibold">
                {operation === "sale" ? "للبيع" : "للإيجار"}
                <button onClick={() => setOperation("")} className="cursor-pointer"><X size={12} /></button>
              </span>
            )}
            {type && (
              <span className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-semibold">
                {TYPE_LABELS[type]}
                <button onClick={() => setType("")} className="cursor-pointer"><X size={12} /></button>
              </span>
            )}
            {wilaya && (
              <span className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-semibold">
                {wilaya}
                <button onClick={() => setWilaya("")} className="cursor-pointer"><X size={12} /></button>
              </span>
            )}
            {(minPrice || maxPrice) && (
              <span className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-semibold">
                السعر: {minPrice || "0"} — {maxPrice || "∞"}
                <button onClick={() => { setMinPrice(""); setMaxPrice(""); }} className="cursor-pointer"><X size={12} /></button>
              </span>
            )}
          </div>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon"><Home /></EmptyMedia>
              <EmptyTitle>لا توجد إعلانات</EmptyTitle>
              <EmptyDescription>
                {activeFilterCount > 0 ? "جرب تغيير معايير البحث للحصول على نتائج" : "لا توجد عقارات منشورة بعد"}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              {activeFilterCount > 0 ? (
                <Button size="sm" onClick={clearFilters}>مسح الفلاتر</Button>
              ) : (
                <Link to="/add-listing"><Button size="sm">أضف أول إعلان</Button></Link>
              )}
            </EmptyContent>
          </Empty>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((listing) => <ListingCard key={listing._id} listing={listing} />)}
            </div>
            {status === "CanLoadMore" && (
              <div className="text-center mt-8">
                <Button variant="secondary" onClick={() => loadMore(12)} className="gap-2">
                  <ChevronDown size={16} /> تحميل المزيد
                </Button>
              </div>
            )}
            {status === "LoadingMore" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
