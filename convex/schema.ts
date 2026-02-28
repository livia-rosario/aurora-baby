import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
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
  }),

  logs: defineTable({
    user: v.string(),
    action: v.string(),
    details: v.string(),
    date: v.string(),
  }),

  instagramFeed: defineTable({
    imageUrl: v.string(),
    caption: v.optional(v.string()),
    order: v.number(),
    createdAt: v.string(),
  }),

  orders: defineTable({
    clientName: v.string(),
    clientPhone: v.optional(v.string()),
    babyName: v.string(),
    theme: v.string(),
    status: v.string(),
    assignedTo: v.optional(v.string()),
    totalValue: v.number(),
    amountPaid: v.number(),
    observations: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
    deliveryDate: v.optional(v.string()),
    orderDate: v.optional(v.string()), // YYYY-MM-DD para filtro por mês
  }),

  orderItems: defineTable({
    orderId: v.id("orders"),
    productId: v.string(),
    productName: v.string(),
    quantity: v.number(),
    unitPrice: v.number(),
    totalPrice: v.number(),
  }),

  // Recebimentos avulsos por pedido
  payments: defineTable({
    orderId: v.id("orders"),
    amount: v.number(),
    note: v.optional(v.string()),
    createdAt: v.string(),
  }),

  // Saídas / compras de material
  expenses: defineTable({
    description: v.string(),
    category: v.string(),
    amount: v.number(),
    date: v.string(),
    createdAt: v.string(),
  }),
});
