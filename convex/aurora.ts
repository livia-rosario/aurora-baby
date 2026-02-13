import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

export const getLogs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("logs").order("desc").take(50);
  },
});

export const updateProduct = mutation({
  args: {
    id: v.id("products"),
    name: v.string(),
    price: v.number(),
    description: v.string(),
    specs: v.array(v.string()),
    category: v.optional(v.string()),
    whatsappMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const addProduct = mutation({
  args: {
    id: v.string(),
    name: v.string(),
    price: v.number(),
    category: v.string(),
    description: v.string(),
    specs: v.array(v.string()),
    images: v.object({
      main: v.string(),
      gallery: v.array(v.string()),
    }),
    whatsappMessage: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("products", args);
  },
});

export const deleteProduct = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const addLog = mutation({
  args: {
    user: v.string(),
    action: v.string(),
    details: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("logs", args);
  },
});

export const seedProducts = mutation({
  args: {
    items: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    for (const item of args.items) {
      // Verifica se o produto já existe pelo 'id' string para evitar duplicatas
      const existing = await ctx.db
        .query("products")
        .filter((q) => q.eq(q.field("id"), item.id))
        .first();
      
      if (!existing) {
        await ctx.db.insert("products", item);
      }
    }
  },
});

export const getInstagramFeed = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("instagramFeed").order("asc").collect();
  },
});

export const addInstagramImage = mutation({
  args: {
    imageUrl: v.string(),
    caption: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const maxOrder = await ctx.db
      .query("instagramFeed")
      .collect()
      .then((items) => Math.max(...items.map((i) => i.order), 0));
    
    await ctx.db.insert("instagramFeed", {
      imageUrl: args.imageUrl,
      caption: args.caption || "",
      order: maxOrder + 1,
      createdAt: new Date().toLocaleString("pt-BR"),
    });
  },
});

export const deleteInstagramImage = mutation({
  args: { id: v.id("instagramFeed") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const reorderInstagramImages = mutation({
  args: {
    images: v.array(v.object({
      id: v.id("instagramFeed"),
      order: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    for (const img of args.images) {
      await ctx.db.patch(img.id, { order: img.order });
    }
  },
});
