import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    isAdmin: v.optional(v.boolean()),
  }).index("by_token", ["tokenIdentifier"]),

  listings: defineTable({
    title: v.string(),
    description: v.string(),
    type: v.union(v.literal("apartment"), v.literal("house"), v.literal("land"), v.literal("commercial"), v.literal("villa")),
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
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    authorId: v.optional(v.id("users")),
    featured: v.optional(v.boolean()),
    views: v.optional(v.number()),
  })
    .index("by_status", ["status"])
    .index("by_wilaya", ["wilaya"])
    .index("by_operation", ["operation"])
    .index("by_type", ["type"])
    .index("by_status_and_operation", ["status", "operation"]),
});
