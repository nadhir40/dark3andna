import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import type { QueryCtx } from "./_generated/server.d.ts";
import type { Id } from "./_generated/dataModel.d.ts";

// مساعد لتحويل storage IDs إلى روابط صور
async function resolveImageUrls(
  ctx: QueryCtx,
  storageIds: Id<"_storage">[]
): Promise<string[]> {
  const urls = await Promise.all(storageIds.map((id) => ctx.storage.getUrl(id)));
  return urls.filter((url): url is string => url !== null);
}

// ========== إنشاء إعلان ==========
export const createListing = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    type: v.union(
      v.literal("apartment"),
      v.literal("house"),
      v.literal("land"),
      v.literal("commercial"),
      v.literal("villa")
    ),
    operation: v.union(v.literal("sale"), v.literal("rent")),
    price: v.number(),
    priceUnit: v.union(v.literal("dzd"), v.literal("eur"), v.literal("usd")),
    rentPeriod: v.optional(v.union(v.literal("monthly"), v.literal("yearly"))),
    wilaya: v.string(),
    commune: v.optional(v.string()),
    area: v.optional(v.number()),
    rooms: v.optional(v.number()),
    bathrooms: v.optional(v.number()),
    floor: v.optional(v.number()),
    imageStorageIds: v.array(v.id("_storage")),
    contactPhone: v.string(),
    contactName: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    let authorId: Id<"users"> | undefined = undefined;

    if (identity) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) =>
          q.eq("tokenIdentifier", identity.tokenIdentifier)
        )
        .unique();
      if (user) authorId = user._id;
    }

    return await ctx.db.insert("listings", {
      ...args,
      status: "pending",
      views: 0,
      featured: false,
      authorId,
    });
  },
});

// ========== آخر الإعلانات المعتمدة للصفحة الرئيسية ==========
export const getFeaturedListings = query({
  args: {},
  handler: async (ctx) => {
    const listings = await ctx.db
      .query("listings")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .order("desc")
      .take(8);

    return await Promise.all(
      listings.map(async (l) => ({
        ...l,
        imageUrls: await resolveImageUrls(ctx, l.imageStorageIds),
      }))
    );
  },
});

// ========== قائمة الإعلانات المعتمدة مع تصفية وصفحات ==========
export const getApprovedListings = query({
  args: {
    paginationOpts: paginationOptsValidator,
    wilaya: v.optional(v.string()),
    operation: v.optional(v.union(v.literal("sale"), v.literal("rent"))),
    type: v.optional(
      v.union(
        v.literal("apartment"),
        v.literal("house"),
        v.literal("land"),
        v.literal("commercial"),
        v.literal("villa")
      )
    ),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("listings")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .order("desc")
      .paginate(args.paginationOpts);

    return {
      ...result,
      page: await Promise.all(
        result.page.map(async (l) => ({
          ...l,
          imageUrls: await resolveImageUrls(ctx, l.imageStorageIds),
        }))
      ),
    };
  },
});

// ========== تفاصيل إعلان واحد ==========
export const getListing = query({
  args: { id: v.id("listings") },
  handler: async (ctx, args) => {
    const l = await ctx.db.get(args.id);
    if (!l) return null;
    return {
      ...l,
      imageUrls: await resolveImageUrls(ctx, l.imageStorageIds),
    };
  },
});

// ========== زيادة عداد المشاهدات ==========
export const incrementViews = mutation({
  args: { id: v.id("listings") },
  handler: async (ctx, args) => {
    const listing = await ctx.db.get(args.id);
    if (!listing) return;
    await ctx.db.patch(args.id, { views: (listing.views ?? 0) + 1 });
  },
});

// ========== الإعلانات قيد المراجعة (للمشرف) ==========
export const getPendingListings = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity)
      throw new ConvexError({ message: "غير مصرح", code: "UNAUTHENTICATED" });

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user?.isAdmin)
      throw new ConvexError({ message: "غير مصرح", code: "FORBIDDEN" });

    const listings = await ctx.db
      .query("listings")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .order("desc")
      .collect();

    return await Promise.all(
      listings.map(async (l) => ({
        ...l,
        imageUrls: await resolveImageUrls(ctx, l.imageStorageIds),
      }))
    );
  },
});

// ========== كل الإعلانات (للمشرف) ==========
export const getAllListingsAdmin = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity)
      throw new ConvexError({ message: "غير مصرح", code: "UNAUTHENTICATED" });

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user?.isAdmin)
      throw new ConvexError({ message: "غير مصرح", code: "FORBIDDEN" });

    const listings = await ctx.db
      .query("listings")
      .order("desc")
      .take(200);

    return await Promise.all(
      listings.map(async (l) => ({
        ...l,
        imageUrls: await resolveImageUrls(ctx, l.imageStorageIds),
      }))
    );
  },
});

// ========== تحديث حالة الإعلان (للمشرف) ==========
export const updateListingStatus = mutation({
  args: {
    id: v.id("listings"),
    status: v.union(
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("pending")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity)
      throw new ConvexError({ message: "غير مصرح", code: "UNAUTHENTICATED" });

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user?.isAdmin)
      throw new ConvexError({ message: "غير مصرح", code: "FORBIDDEN" });

    await ctx.db.patch(args.id, { status: args.status });
  },
});

// ========== حذف إعلان (للمشرف) ==========
export const deleteListing = mutation({
  args: { id: v.id("listings") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity)
      throw new ConvexError({ message: "غير مصرح", code: "UNAUTHENTICATED" });

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user?.isAdmin)
      throw new ConvexError({ message: "غير مصرح", code: "FORBIDDEN" });

    const listing = await ctx.db.get(args.id);
    if (listing) {
      // حذف الصور من التخزين
      await Promise.all(
        listing.imageStorageIds.map((id) => ctx.storage.delete(id))
      );
    }
    await ctx.db.delete(args.id);
  },
});

// ========== تمييز/إلغاء تمييز إعلان (للمشرف) ==========
export const toggleFeatured = mutation({
  args: { id: v.id("listings"), featured: v.boolean() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity)
      throw new ConvexError({ message: "غير مصرح", code: "UNAUTHENTICATED" });

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user?.isAdmin)
      throw new ConvexError({ message: "غير مصرح", code: "FORBIDDEN" });

    await ctx.db.patch(args.id, { featured: args.featured });
  },
});
