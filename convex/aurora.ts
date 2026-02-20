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

export const seedInstagramFeed = mutation({
  args: {
    images: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("instagramFeed").collect();
    if (existing.length === 0) {
      for (let i = 0; i < args.images.length; i++) {
        await ctx.db.insert("instagramFeed", {
          imageUrl: args.images[i],
          caption: `Post antigo ${i + 1}`,
          order: i,
          createdAt: new Date().toLocaleString("pt-BR"),
        });
      }
    }
  },
});

export const createOrder = mutation({
  args: {
    clientName: v.string(),
    clientPhone: v.optional(v.string()),
    items: v.array(v.object({
      productId: v.string(),
      productName: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
    })),
    observations: v.optional(v.string()),
    deliveryDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const totalValue = args.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    
    const orderId = await ctx.db.insert("orders", {
      clientName: args.clientName,
      clientPhone: args.clientPhone || "",
      status: "Pedido Feito",
      assignedTo: "",
      totalValue,
      amountPaid: 0,
      observations: args.observations || "",
      createdAt: new Date().toLocaleString("pt-BR"),
      updatedAt: new Date().toLocaleString("pt-BR"),
      deliveryDate: args.deliveryDate || "",
    });

    for (const item of args.items) {
      await ctx.db.insert("orderItems", {
        orderId,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.unitPrice * item.quantity,
      });
    }

    return orderId;
  },
});

export const getOrders = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await ctx.db
          .query("orderItems")
          .filter((q) => q.eq(q.field("orderId"), order._id))
          .collect();
        return { ...order, items };
      })
    );
    return ordersWithItems;
  },
});

export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.string(),
    assignedTo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      status: args.status,
      assignedTo: args.assignedTo || "",
      updatedAt: new Date().toLocaleString("pt-BR"),
    });
  },
});

export const updateOrderPayment = mutation({
  args: {
    orderId: v.id("orders"),
    amountPaid: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      amountPaid: args.amountPaid,
      updatedAt: new Date().toLocaleString("pt-BR"),
    });
  },
});

export const updateOrderObservations = mutation({
  args: {
    orderId: v.id("orders"),
    observations: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      observations: args.observations,
      updatedAt: new Date().toLocaleString("pt-BR"),
    });
  },
});

export const deleteOrder = mutation({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("orderItems")
      .filter((q) => q.eq(q.field("orderId"), args.orderId))
      .collect();
    
    for (const item of items) {
      await ctx.db.delete(item._id);
    }
    
    await ctx.db.delete(args.orderId);
  },
});

export const getOrderMetrics = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();
    
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalValue, 0);
    const totalReceived = orders.reduce((sum, order) => sum + order.amountPaid, 0);
    const totalPending = totalRevenue - totalReceived;
    const deliveredOrders = orders.filter((o) => o.status === "Entregue").length;
    
    return {
      totalOrders,
      totalRevenue,
      totalReceived,
      totalPending,
      deliveredOrders,
    };
  },
});
