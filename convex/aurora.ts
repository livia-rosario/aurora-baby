import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ─── PRODUTOS ────────────────────────────────────────────────────────────────

export const getProducts = query({
  args: {},
  handler: async (ctx) => await ctx.db.query("products").collect(),
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
    images: v.object({ main: v.string(), gallery: v.array(v.string()) }),
    whatsappMessage: v.string(),
  },
  handler: async (ctx, args) => { await ctx.db.insert("products", args); },
});

export const deleteProduct = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

export const seedProducts = mutation({
  args: { items: v.array(v.any()) },
  handler: async (ctx, args) => {
    for (const item of args.items) {
      const existing = await ctx.db.query("products").filter((q) => q.eq(q.field("id"), item.id)).first();
      if (!existing) await ctx.db.insert("products", item);
    }
  },
});

// ─── LOGS ────────────────────────────────────────────────────────────────────

export const getLogs = query({
  args: {},
  handler: async (ctx) => await ctx.db.query("logs").order("desc").take(100),
});

export const addLog = mutation({
  args: { user: v.string(), action: v.string(), details: v.string(), date: v.string() },
  handler: async (ctx, args) => { await ctx.db.insert("logs", args); },
});

// ─── INSTAGRAM ───────────────────────────────────────────────────────────────

export const getInstagramFeed = query({
  args: {},
  handler: async (ctx) => await ctx.db.query("instagramFeed").order("asc").collect(),
});

export const addInstagramImage = mutation({
  args: { imageUrl: v.string(), caption: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const items = await ctx.db.query("instagramFeed").collect();
    const maxOrder = items.length > 0 ? Math.max(...items.map((i) => i.order)) : 0;
    await ctx.db.insert("instagramFeed", { imageUrl: args.imageUrl, caption: args.caption || "", order: maxOrder + 1, createdAt: new Date().toLocaleString("pt-BR") });
  },
});

export const deleteInstagramImage = mutation({
  args: { id: v.id("instagramFeed") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

export const reorderInstagramImages = mutation({
  args: { images: v.array(v.object({ id: v.id("instagramFeed"), order: v.number() })) },
  handler: async (ctx, args) => {
    for (const img of args.images) await ctx.db.patch(img.id, { order: img.order });
  },
});

export const seedInstagramFeed = mutation({
  args: { images: v.array(v.string()) },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("instagramFeed").collect();
    if (existing.length === 0) {
      for (let i = 0; i < args.images.length; i++) {
        await ctx.db.insert("instagramFeed", { imageUrl: args.images[i], caption: `Post ${i + 1}`, order: i, createdAt: new Date().toLocaleString("pt-BR") });
      }
    }
  },
});

// ─── PEDIDOS ─────────────────────────────────────────────────────────────────

export const getOrders = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").order("desc").collect();
    return await Promise.all(orders.map(async (order) => {
      const items = await ctx.db.query("orderItems").filter((q) => q.eq(q.field("orderId"), order._id)).collect();
      const payments = await ctx.db.query("payments").filter((q) => q.eq(q.field("orderId"), order._id)).collect();
      return { ...order, items, payments };
    }));
  },
});

export const createOrder = mutation({
  args: {
    clientName: v.string(),
    clientPhone: v.optional(v.string()),
    babyName: v.string(),
    theme: v.string(),
    items: v.array(v.object({ productId: v.string(), productName: v.string(), quantity: v.number(), unitPrice: v.number() })),
    observations: v.optional(v.string()),
    initialPayment: v.optional(v.number()),
    orderDate: v.optional(v.string()),
    discount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const subtotal = args.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const discount = args.discount || 0;
    const totalValue = Math.max(0, subtotal - discount);
    const initialPaid = args.initialPayment || 0;

    const orderId = await ctx.db.insert("orders", {
      clientName: args.clientName,
      clientPhone: args.clientPhone || "",
      babyName: args.babyName,
      theme: args.theme,
      status: "Pedido Feito",
      totalValue,
      discount,
      amountPaid: initialPaid,
      observations: args.observations || "",
      createdAt: new Date().toLocaleString("pt-BR"),
      updatedAt: new Date().toLocaleString("pt-BR"),
      orderDate: args.orderDate || new Date().toISOString().split("T")[0],
    });

    for (const item of args.items) {
      await ctx.db.insert("orderItems", { orderId, productId: item.productId, productName: item.productName, quantity: item.quantity, unitPrice: item.unitPrice, totalPrice: item.unitPrice * item.quantity });
    }

    if (initialPaid > 0) {
      await ctx.db.insert("payments", { orderId, amount: initialPaid, note: "Entrada", createdAt: new Date().toLocaleString("pt-BR") });
    }

    return orderId;
  },
});

export const updateOrder = mutation({
  args: {
    orderId: v.id("orders"),
    clientName: v.string(),
    clientPhone: v.optional(v.string()),
    babyName: v.string(),
    theme: v.string(),
    observations: v.optional(v.string()),
    orderDate: v.optional(v.string()),
    discount: v.optional(v.number()),
    items: v.array(v.object({ productId: v.string(), productName: v.string(), quantity: v.number(), unitPrice: v.number() })),
  },
  handler: async (ctx, args) => {
    const subtotal = args.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const discount = args.discount || 0;
    const totalValue = Math.max(0, subtotal - discount);

    await ctx.db.patch(args.orderId, {
      clientName: args.clientName,
      clientPhone: args.clientPhone || "",
      babyName: args.babyName,
      theme: args.theme,
      observations: args.observations || "",
      orderDate: args.orderDate,
      discount,
      totalValue,
      updatedAt: new Date().toLocaleString("pt-BR"),
    });

    // Recriar os itens
    const oldItems = await ctx.db.query("orderItems").filter((q) => q.eq(q.field("orderId"), args.orderId)).collect();
    for (const item of oldItems) await ctx.db.delete(item._id);
    for (const item of args.items) {
      await ctx.db.insert("orderItems", { orderId: args.orderId, productId: item.productId, productName: item.productName, quantity: item.quantity, unitPrice: item.unitPrice, totalPrice: item.unitPrice * item.quantity });
    }
  },
});

export const updateOrderStatus = mutation({
  args: { orderId: v.id("orders"), status: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, { status: args.status, updatedAt: new Date().toLocaleString("pt-BR") });
  },
});

export const deleteOrder = mutation({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const items = await ctx.db.query("orderItems").filter((q) => q.eq(q.field("orderId"), args.orderId)).collect();
    for (const item of items) await ctx.db.delete(item._id);
    const payments = await ctx.db.query("payments").filter((q) => q.eq(q.field("orderId"), args.orderId)).collect();
    for (const p of payments) await ctx.db.delete(p._id);
    await ctx.db.delete(args.orderId);
  },
});

// ─── PAGAMENTOS ──────────────────────────────────────────────────────────────

export const addPayment = mutation({
  args: { orderId: v.id("orders"), amount: v.number(), note: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Pedido não encontrado");
    const newAmountPaid = order.amountPaid + args.amount;
    if (newAmountPaid > order.totalValue) throw new Error(`Valor excede o total (R$ ${order.totalValue.toFixed(2)})`);
    await ctx.db.insert("payments", { orderId: args.orderId, amount: args.amount, note: args.note || "", createdAt: new Date().toLocaleString("pt-BR") });
    await ctx.db.patch(args.orderId, { amountPaid: newAmountPaid, updatedAt: new Date().toLocaleString("pt-BR") });
  },
});

export const deletePayment = mutation({
  args: { paymentId: v.id("payments"), orderId: v.id("orders"), amount: v.number() },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Pedido não encontrado");
    await ctx.db.delete(args.paymentId);
    await ctx.db.patch(args.orderId, { amountPaid: Math.max(0, order.amountPaid - args.amount), updatedAt: new Date().toLocaleString("pt-BR") });
  },
});

export const payOrderFull = mutation({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Pedido não encontrado");
    const remaining = order.totalValue - order.amountPaid;
    if (remaining <= 0) return;
    await ctx.db.insert("payments", { orderId: args.orderId, amount: remaining, note: "Pagamento total", createdAt: new Date().toLocaleString("pt-BR") });
    await ctx.db.patch(args.orderId, { amountPaid: order.totalValue, updatedAt: new Date().toLocaleString("pt-BR") });
  },
});

// ─── SAÍDAS ──────────────────────────────────────────────────────────────────

export const getExpenses = query({
  args: {},
  handler: async (ctx) => await ctx.db.query("expenses").order("desc").collect(),
});

export const addExpense = mutation({
  args: { description: v.string(), category: v.string(), amount: v.number(), date: v.string() },
  handler: async (ctx, args) => { await ctx.db.insert("expenses", { ...args, createdAt: new Date().toLocaleString("pt-BR") }); },
});

export const deleteExpense = mutation({
  args: { id: v.id("expenses") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ─── MÉTRICAS ────────────────────────────────────────────────────────────────

export const getOrderMetrics = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();
    const expenses = await ctx.db.query("expenses").collect();
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalValue, 0);
    const totalReceived = orders.reduce((sum, o) => sum + o.amountPaid, 0);
    const totalPending = totalRevenue - totalReceived;
    const deliveredOrders = orders.filter((o) => o.status === "Entregue").length;
    const inProductionOrders = orders.filter((o) => o.status !== "Entregue").length;
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = totalReceived - totalExpenses;
    return {
      totalOrders, totalRevenue, totalReceived, totalPending,
      deliveredOrders, inProductionOrders, totalExpenses, netProfit,
      byStatus: {
        "Pedido Feito": orders.filter(o => o.status === "Pedido Feito").length,
        "Personalizacao": orders.filter(o => o.status === "Personalização").length,
        "Acabamento": orders.filter(o => o.status === "Acabamento").length,
        "Pronto": orders.filter(o => o.status === "Pronto").length,
        "Entregue": orders.filter(o => o.status === "Entregue").length,
      },
    };
  },
});

// ─── MIGRAÇÃO ────────────────────────────────────────────────────────────────

export const fixOrderDates = mutation({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();
    let count = 0;
    for (const order of orders) {
      await ctx.db.patch(order._id, { orderDate: "2026-02-10" });
      count++;
    }
    return `${count} pedidos atualizados para 2026-02-10`;
  },
});
