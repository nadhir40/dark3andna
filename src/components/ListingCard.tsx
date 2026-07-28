import type { Doc } from "@/convex/_generated/dataModel.d.ts";
import { Link } from "react-router-dom";
import { MapPin, BedDouble, Maximize2, Eye } from "lucide-react";
import { getPropertyTypeLabel, getOperationLabel, formatPrice } from "@/lib/listing-utils.ts";
import { Badge } from "@/components/ui/badge.tsx";

type ListingWithUrls = Doc<"listings"> & { imageUrls: string[] };
const FALLBACK = "https://images.unsplash.com/photo-1651009793956-6684bba370f3?w=400&q=80";

export default function ListingCard({ listing }: { listing: ListingWithUrls }) {
  const mainImage = listing.imageUrls[0] ?? FALLBACK;
  return (
    <Link to={`/listings/${listing._id}`} className="group block cursor-pointer">
      <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-border group-hover:border-primary/30">
        <div className="relative overflow-hidden h-48">
          <img src={mainImage} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute top-2 right-2 flex gap-1">
            <Badge className={listing.operation === "sale" ? "bg-primary text-primary-foreground font-bold" : "bg-blue-600 text-white font-bold"}>
              {getOperationLabel(listing.operation)}
            </Badge>
            {listing.featured && <Badge className="bg-yellow-500 text-black font-bold">مميز</Badge>}
          </div>
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="text-xs">{getPropertyTypeLabel(listing.type)}</Badge>
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-bold text-base text-card-foreground truncate mb-1">{listing.title}</h3>
          <div className="flex items-center gap-1 text-muted-foreground text-xs mb-2">
            <MapPin size={12} className="text-primary" />
            <span>{listing.wilaya}{listing.commune ? ` - ${listing.commune}` : ""}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            {listing.rooms != null && <span className="flex items-center gap-1"><BedDouble size={12} /> {listing.rooms} غرف</span>}
            {listing.area != null && <span className="flex items-center gap-1"><Maximize2 size={12} /> {listing.area} م²</span>}
            {listing.views != null && <span className="flex items-center gap-1 mr-auto"><Eye size={12} /> {listing.views}</span>}
          </div>
          <div className="font-black text-primary text-lg">
            {formatPrice(listing.price, listing.priceUnit)}
            {listing.operation === "rent" && listing.rentPeriod && (
              <span className="text-xs font-normal text-muted-foreground mr-1">/ {listing.rentPeriod === "monthly" ? "شهر" : "سنة"}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
