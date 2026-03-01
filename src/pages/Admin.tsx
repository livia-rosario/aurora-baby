import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  LogOut, Save, X, Loader2, History, Plus, Trash2, Image as ImageIcon,
  Upload, ShoppingBag, LayoutDashboard, TrendingDown, Package,
  ChevronRight, CheckCheck, Check, Edit2, Copy, MessageCircle,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import initialProducts from "../data/products.json";

const USERS = [
  { username: "miriam", password: "miriam1965", name: "Miriam" },
  { username: "denize", password: "denize1961", name: "Denize" },
  { username: "admin", password: "admin2026", name: "Lívia" },
];

const STATUS_ORDER = ["Pedido Feito", "Personalização", "Acabamento", "Pronto", "Entregue"];
const KANBAN_STATUS = ["Pedido Feito", "Personalização", "Acabamento", "Pronto"];
const STATUS_COLORS: Record<string, string> = {
  "Pedido Feito": "bg-blue-100 text-blue-700 border-blue-200",
  "Personalização": "bg-purple-100 text-purple-700 border-purple-200",
  "Acabamento": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "Pronto": "bg-green-100 text-green-700 border-green-200",
  "Entregue": "bg-gray-100 text-gray-600 border-gray-200",
};
const STATUS_BG: Record<string, string> = {
  "Pedido Feito": "bg-blue-50 border-blue-100",
  "Personalização": "bg-purple-50 border-purple-100",
  "Acabamento": "bg-yellow-50 border-yellow-100",
  "Pronto": "bg-green-50 border-green-100",
  "Entregue": "bg-gray-50 border-gray-100",
};
const EXPENSE_CATEGORIES = ["Tecido", "Linha", "Aviamento", "Embalagem", "Máquina/Equipamento", "Frete", "Marketing", "Outros"];
type Tab = "orders" | "products" | "feed" | "financial" | "logs";

function generateWhatsappText(order: any): string {
  const lines = order.items?.map((i: any) => `• ${i.quantity}x ${i.productName} - R$ ${(i.unitPrice * i.quantity).toFixed(2)}`) || [];
  if (order.discount > 0) lines.push(`• Desconto - -R$ ${order.discount.toFixed(2)}`);
  return `Olá, ${order.clientName}! 🌸\n\nAqui está o resumo do pedido:\n${lines.join("\n")}\n\nTotal: R$ ${order.totalValue.toFixed(2)}\n\nObrigada pela confiança! Com muito amor e carinho 🤍 — Aurora Baby`;
}

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [copied, setCopied] = useState(false);

  const products = useQuery(api.aurora.getProducts);
  const logs = useQuery(api.aurora.getLogs);
  const instagramFeed = useQuery(api.aurora.getInstagramFeed);
  const orders = useQuery(api.aurora.getOrders);
  const expenses = useQuery(api.aurora.getExpenses);
  const metrics = useQuery(api.aurora.getOrderMetrics);

  const updateProductMut = useMutation(api.aurora.updateProduct);
  const addProductMut = useMutation(api.aurora.addProduct);
  const deleteProductMut = useMutation(api.aurora.deleteProduct);
  const addLog = useMutation(api.aurora.addLog);
  const seedProducts = useMutation(api.aurora.seedProducts);
  const addInstagramImage = useMutation(api.aurora.addInstagramImage);
  const deleteInstagramImage = useMutation(api.aurora.deleteInstagramImage);
  const seedInstagramFeed = useMutation(api.aurora.seedInstagramFeed);
  const createOrder = useMutation(api.aurora.createOrder);
  const updateOrder = useMutation(api.aurora.updateOrder);
  const updateOrderStatus = useMutation(api.aurora.updateOrderStatus);
  const deleteOrder = useMutation(api.aurora.deleteOrder);
  const addPayment = useMutation(api.aurora.addPayment);
  const deletePayment = useMutation(api.aurora.deletePayment);
  const payOrderFull = useMutation(api.aurora.payOrderFull);
  const addExpense = useMutation(api.aurora.addExpense);
  const deleteExpense = useMutation(api.aurora.deleteExpense);

  // Estados produto
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Estados instagram
  const [instagramUrl, setInstagramUrl] = useState("");
  const [instagramCaption, setInstagramCaption] = useState("");

  // Estados pedidos
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [paymentInputs, setPaymentInputs] = useState<Record<string, string>>({});
  const [paymentNotes, setPaymentNotes] = useState<Record<string, string>>({});
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));

  const emptyOrder = { clientName: "", clientPhone: "", babyName: "", theme: "", observations: "", items: [] as any[], initialPayment: "", orderDate: new Date().toISOString().split("T")[0], discount: "" };
  const [newOrder, setNewOrder] = useState(emptyOrder);
  const [orderProductSelect, setOrderProductSelect] = useState("");
  const [orderProductQty, setOrderProductQty] = useState(1);

  // Estados despesas
  const [newExpense, setNewExpense] = useState({ description: "", category: "Tecido", amount: "", date: new Date().toISOString().split("T")[0] });
  const [isAddingExpense, setIsAddingExpense] = useState(false);

  // Estados financeiro
  const [finFilterMonth, setFinFilterMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    const savedUser = sessionStorage.getItem("admin_user");
    if (savedUser) { setIsLoggedIn(true); setCurrentUser(savedUser); }
  }, []);

  const log = (action: string, details: string) =>
    addLog({ user: currentUser, action, details, date: new Date().toLocaleString("pt-BR") });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = USERS.find(u => u.username === username.toLowerCase() && u.password === password);
    if (user) { setIsLoggedIn(true); setCurrentUser(user.name); sessionStorage.setItem("admin_user", user.name); setError(""); }
    else setError("Usuário ou senha incorretos.");
  };
  const handleLogout = () => { setIsLoggedIn(false); sessionStorage.removeItem("admin_user"); };

  // Produtos
  const handleSaveProduct = async () => {
    if (!editingProduct.name || editingProduct.price <= 0) { alert("Preencha nome e preço!"); return; }
    setIsSaving(true);
    try {
      if (isAddingNew) {
        await addProductMut({ id: editingProduct.id, name: editingProduct.name, price: editingProduct.price, category: editingProduct.category, description: editingProduct.description, specs: editingProduct.specs.filter((s: string) => s.trim()), images: editingProduct.images, whatsappMessage: editingProduct.whatsappMessage || "" });
        await log(`Criou produto ${editingProduct.name}`, `R$ ${editingProduct.price}`);
      } else {
        await updateProductMut({ id: editingProduct._id, name: editingProduct.name, price: editingProduct.price, category: editingProduct.category, description: editingProduct.description, specs: editingProduct.specs.filter((s: string) => s.trim()), whatsappMessage: editingProduct.whatsappMessage });
        await log(`Editou produto ${editingProduct.name}`, `R$ ${editingProduct.price}`);
      }
      setEditingProduct(null);
    } catch (err: any) { alert("Erro: " + err.message); }
    finally { setIsSaving(false); }
  };

  // Instagram
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setIsUploadingImage(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try { await addInstagramImage({ imageUrl: ev.target?.result as string, caption: instagramCaption }); setInstagramCaption(""); setInstagramUrl(""); }
      catch (err: any) { alert("Erro: " + err.message); }
      finally { setIsUploadingImage(false); }
    };
    reader.readAsDataURL(file);
  };

  // Helpers para form de pedido
  const addProductToForm = (items: any[], setItems: (i: any[]) => void) => {
    const product = products?.find((p: any) => p.id === orderProductSelect);
    if (!product) return;
    const existing = items.find((i: any) => i.productId === (product as any).id);
    if (existing) setItems(items.map((i: any) => i.productId === (product as any).id ? { ...i, quantity: i.quantity + orderProductQty } : i));
    else setItems([...items, { productId: (product as any).id, productName: (product as any).name, quantity: orderProductQty, unitPrice: (product as any).price }]);
    setOrderProductSelect(""); setOrderProductQty(1);
  };

  const calcTotal = (items: any[], discount: string) => {
    const subtotal = items.reduce((s: number, i: any) => s + i.unitPrice * i.quantity, 0);
    return Math.max(0, subtotal - (parseFloat(discount) || 0));
  };

  // Criar pedido
  const handleCreateOrder = async () => {
    if (!newOrder.clientName || !newOrder.babyName || newOrder.items.length === 0) { alert("Preencha nome da cliente, bebê e produtos!"); return; }
    try {
      await createOrder({ clientName: newOrder.clientName, clientPhone: newOrder.clientPhone, babyName: newOrder.babyName, theme: newOrder.theme, items: newOrder.items, observations: newOrder.observations, initialPayment: parseFloat(newOrder.initialPayment) || 0, orderDate: newOrder.orderDate, discount: parseFloat(newOrder.discount) || 0 });
      await log(`Criou pedido para ${newOrder.clientName}`, `Bebê: ${newOrder.babyName} | Total: R$ ${calcTotal(newOrder.items, newOrder.discount).toFixed(2)}`);
      setNewOrder(emptyOrder); setIsCreatingOrder(false);
    } catch (err: any) { alert("Erro: " + err.message); }
  };

  // Editar pedido
  const openEditOrder = (order: any) => {
    setEditingOrder({ ...order, discount: String(order.discount || ""), items: order.items?.map((i: any) => ({ ...i })) || [] });
  };
  const handleUpdateOrder = async () => {
    if (!editingOrder.clientName || !editingOrder.babyName || editingOrder.items.length === 0) { alert("Preencha os campos obrigatórios!"); return; }
    try {
      await updateOrder({ orderId: editingOrder._id, clientName: editingOrder.clientName, clientPhone: editingOrder.clientPhone, babyName: editingOrder.babyName, theme: editingOrder.theme, observations: editingOrder.observations, orderDate: editingOrder.orderDate, discount: parseFloat(editingOrder.discount) || 0, items: editingOrder.items });
      await log(`Editou pedido de ${editingOrder.clientName}`, `Bebê: ${editingOrder.babyName}`);
      // Atualiza selectedOrder se estiver aberto
      if (selectedOrder?._id === editingOrder._id) {
        setSelectedOrder({ ...selectedOrder, ...editingOrder, totalValue: calcTotal(editingOrder.items, editingOrder.discount), discount: parseFloat(editingOrder.discount) || 0 });
      }
      setEditingOrder(null);
    } catch (err: any) { alert("Erro: " + err.message); }
  };

  const handleStatusChange = async (orderId: any, newStatus: string, order: any) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus });
      await log(`Pedido de ${order.clientName} → "${newStatus}"`, `Bebê: ${order.babyName}`);
      if (selectedOrder?._id === orderId) setSelectedOrder({ ...selectedOrder, status: newStatus });
    } catch (err: any) { alert("Erro: " + err.message); }
  };

  const handleAddPayment = async (orderId: any, order: any) => {
    const amount = parseFloat(paymentInputs[orderId] || "0");
    if (!amount || amount <= 0) { alert("Digite um valor válido!"); return; }
    try {
      await addPayment({ orderId, amount, note: paymentNotes[orderId] || "" });
      await log(`Pagamento de R$ ${amount.toFixed(2)} em pedido de ${order.clientName}`, paymentNotes[orderId] || "Sem obs");
      setPaymentInputs({ ...paymentInputs, [orderId]: "" });
      setPaymentNotes({ ...paymentNotes, [orderId]: "" });
    } catch (err: any) { alert(err.message); }
  };

  const handleDeletePayment = async (payment: any, order: any) => {
    if (confirm(`Remover pagamento de R$ ${payment.amount.toFixed(2)}?`)) {
      try {
        await deletePayment({ paymentId: payment._id, orderId: order._id, amount: payment.amount });
        await log(`Removeu pagamento de R$ ${payment.amount.toFixed(2)} do pedido de ${order.clientName}`, "");
      } catch (err: any) { alert(err.message); }
    }
  };

  const handlePayFull = async (orderId: any, order: any) => {
    if (confirm("Marcar como pago totalmente?")) {
      try {
        await payOrderFull({ orderId });
        await log(`Pedido de ${order.clientName} pago totalmente`, `R$ ${order.totalValue.toFixed(2)}`);
      } catch (err: any) { alert("Erro: " + err.message); }
    }
  };

  const handleDeleteOrder = async (orderId: any, order: any) => {
    if (confirm("Excluir este pedido?")) {
      try {
        await deleteOrder({ orderId });
        await log(`Excluiu pedido de ${order.clientName}`, `Bebê: ${order.babyName}`);
        setSelectedOrder(null);
      } catch (err: any) { alert("Erro: " + err.message); }
    }
  };

  const handleAddExpense = async () => {
    if (!newExpense.description || !newExpense.amount || parseFloat(newExpense.amount) <= 0) { alert("Preencha descrição e valor!"); return; }
    try {
      await addExpense({ description: newExpense.description, category: newExpense.category, amount: parseFloat(newExpense.amount), date: newExpense.date });
      await log(`Registrou saída: ${newExpense.description}`, `R$ ${newExpense.amount} | ${newExpense.category}`);
      setNewExpense({ description: "", category: "Tecido", amount: "", date: new Date().toISOString().split("T")[0] });
      setIsAddingExpense(false);
    } catch (err: any) { alert("Erro: " + err.message); }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredOrders = orders?.filter((o: any) => (o.orderDate || "").startsWith(filterMonth)) || [];
  const finFilteredOrders = orders?.filter((o: any) => (o.orderDate || "").startsWith(finFilterMonth)) || [];
  const finFilteredExpenses = expenses?.filter((e: any) => e.date.startsWith(finFilterMonth)) || [];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#fdf8f3]">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <img src="/images/logo.png" alt="Aurora Baby" className="h-20 mx-auto mb-4" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <h1 className="font-heading text-3xl font-bold text-[#524330]">Área Admin</h1>
            <p className="text-sm mt-1 text-[#524330]/60">Aurora Baby Boutique</p>
          </div>
          <form onSubmit={handleLogin} className="bg-white rounded-3xl shadow-xl p-8 space-y-4 border border-[#e5d5c5]">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#524330]">Usuário</label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} className="h-14 rounded-2xl text-lg border-[#e5d5c5]" placeholder="seu usuário" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#524330]">Senha</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-14 rounded-2xl text-lg border-[#e5d5c5]" placeholder="••••••••" />
            </div>
            {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
            <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold bg-[#a5daeb] text-[#524330] hover:bg-[#8ecce0]">Entrar</Button>
          </form>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "orders", label: "Pedidos", icon: <ShoppingBag className="w-4 h-4" /> },
    { key: "financial", label: "Financeiro", icon: <LayoutDashboard className="w-4 h-4" /> },
    { key: "products", label: "Produtos", icon: <Package className="w-4 h-4" /> },
    { key: "feed", label: "Feed", icon: <ImageIcon className="w-4 h-4" /> },
    { key: "logs", label: "Histórico", icon: <History className="w-4 h-4" /> },
  ];

  // ── Formulário de itens reutilizável ──
  const OrderItemsForm = ({ items, setItems, discount, setDiscount }: any) => {
    const subtotal = items.reduce((s: number, i: any) => s + i.unitPrice * i.quantity, 0);
    const total = Math.max(0, subtotal - (parseFloat(discount) || 0));
    return (
      <div className="space-y-3">
        <label className="text-sm font-bold text-[#524330]">🛍️ Produtos *</label>
        <div className="flex gap-2">
          <select value={orderProductSelect} onChange={(e) => setOrderProductSelect(e.target.value)}
            className="flex-1 h-12 rounded-xl border border-[#e5d5c5] text-sm text-[#524330] px-3 bg-white">
            <option value="">Selecionar produto...</option>
            {products?.map((p: any) => <option key={p.id} value={p.id}>{p.name} — R$ {p.price}</option>)}
          </select>
          <Input type="number" min={1} value={orderProductQty} onChange={(e) => setOrderProductQty(parseInt(e.target.value) || 1)}
            className="w-16 h-12 rounded-xl border-[#e5d5c5] text-center" />
          <Button onClick={() => addProductToForm(items, setItems)} disabled={!orderProductSelect}
            className="bg-[#a5daeb] text-[#524330] font-bold rounded-xl h-12 px-4 flex-shrink-0">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {items.length > 0 && (
          <div className="bg-[#fdf8f3] rounded-2xl p-4 space-y-2">
            {items.map((item: any) => (
              <div key={item.productId} className="flex items-center justify-between text-sm gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Input type="number" min={1} value={item.quantity}
                    onChange={(e) => setItems(items.map((i: any) => i.productId === item.productId ? { ...i, quantity: parseInt(e.target.value) || 1 } : i))}
                    className="w-14 h-8 rounded-lg border-[#e5d5c5] text-center text-xs flex-shrink-0" />
                  <span className="text-[#524330] truncate">{item.productName}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="font-bold text-[#524330]">R$ {(item.unitPrice * item.quantity).toFixed(2)}</span>
                  <button onClick={() => setItems(items.filter((i: any) => i.productId !== item.productId))} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
            <div className="border-t border-[#e5d5c5] pt-2 space-y-1">
              {(parseFloat(discount) || 0) > 0 && (
                <>
                  <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>R$ {subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm text-red-500"><span>Desconto</span><span>- R$ {(parseFloat(discount)||0).toFixed(2)}</span></div>
                </>
              )}
              <div className="flex justify-between font-bold text-[#524330]"><span>Total</span><span>R$ {total.toFixed(2)}</span></div>
            </div>
          </div>
        )}
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#524330]">✂️ Desconto (R$)</label>
          <Input type="number" step="0.01" value={discount} onChange={(e) => setDiscount(e.target.value)}
            className="h-12 rounded-2xl border-[#e5d5c5] text-base text-red-500 font-bold" placeholder="0,00" />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fdf8f3]">
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-[#e5d5c5]">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" alt="Aurora Baby" className="h-8 w-auto" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <div>
              <p className="font-heading font-bold text-[#524330] text-sm leading-none">Aurora Baby</p>
              <p className="text-[10px] text-gray-400">Olá, {currentUser}!</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="ghost" size="sm" className="text-gray-400 hover:text-red-400 rounded-full gap-1 text-xs">
            <LogOut className="w-3.5 h-3.5" /> Sair
          </Button>
        </div>
        <div className="max-w-6xl mx-auto px-2 flex overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${activeTab === tab.key ? "border-[#a5daeb] text-[#524330]" : "border-transparent text-gray-400"}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 py-5">

        {/* ── PEDIDOS ── */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-heading font-bold text-[#524330]">Pedidos</h2>
              <Button onClick={() => setIsCreatingOrder(true)} className="bg-[#a5daeb] hover:bg-[#8ecce0] text-[#524330] font-bold rounded-full h-10 px-4 gap-1.5 text-sm">
                <Plus className="w-4 h-4" /> Novo
              </Button>
            </div>

            {/* Kanban */}
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-3 px-3">
              {KANBAN_STATUS.map((status) => {
                const statusOrders = orders?.filter((o: any) => o.status === status) || [];
                return (
                  <div key={status} className={`flex-shrink-0 w-64 sm:w-72 rounded-2xl border p-3 ${STATUS_BG[status]}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${STATUS_COLORS[status]}`}>{status}</span>
                      <span className="text-xs font-bold text-gray-400 bg-white rounded-full w-6 h-6 flex items-center justify-center">{statusOrders.length}</span>
                    </div>
                    <div className="space-y-2.5">
                      {statusOrders.map((order: any) => {
                        const pending = order.totalValue - order.amountPaid;
                        const paidPct = Math.min(100, Math.round((order.amountPaid / order.totalValue) * 100));
                        const isExpanded = expandedOrder === order._id;
                        return (
                          <div key={order._id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            <div className="p-3 cursor-pointer" onClick={() => setExpandedOrder(isExpanded ? null : order._id)}>
                              <div className="flex justify-between items-start gap-2">
                                <div className="min-w-0">
                                  <p className="font-bold text-[#524330] text-sm truncate">{order.clientName}</p>
                                  <p className="text-xs text-gray-400 truncate">👶 {order.babyName}{order.theme ? ` · ${order.theme}` : ""}</p>
                                </div>
                                <ChevronRight className={`w-4 h-4 text-gray-300 transition-transform flex-shrink-0 mt-0.5 ${isExpanded ? "rotate-90" : ""}`} />
                              </div>
                              {order.items?.length > 0 && (
                                <div className="mt-1.5 space-y-0.5">
                                  {order.items.slice(0, 2).map((item: any, i: number) => (
                                    <p key={i} className="text-xs text-gray-500 truncate">{item.quantity}x {item.productName}</p>
                                  ))}
                                  {order.items.length > 2 && <p className="text-xs text-gray-400">+{order.items.length - 2} itens</p>}
                                </div>
                              )}
                              <div className="mt-2.5">
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-400">R$ {order.amountPaid.toFixed(2)}</span>
                                  <span className="font-bold text-[#524330]">R$ {order.totalValue.toFixed(2)}</span>
                                </div>
                                <div className="h-1.5 bg-gray-100 rounded-full">
                                  <div className="h-1.5 rounded-full bg-green-400 transition-all" style={{ width: `${paidPct}%` }} />
                                </div>
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="border-t border-gray-100 p-3 space-y-2.5 bg-gray-50/50">
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" className="flex-1 rounded-xl text-xs border-[#e5d5c5] h-9"
                                    onClick={() => { setSelectedOrder(order); setExpandedOrder(null); }}>
                                    Ver detalhes
                                  </Button>
                                  {status === "Pronto" ? (
                                    <Button size="sm" className="flex-1 rounded-xl text-xs bg-green-500 hover:bg-green-600 text-white font-bold h-9"
                                      onClick={() => handleStatusChange(order._id, "Entregue", order)}>
                                      ✅ Entregue
                                    </Button>
                                  ) : (
                                    <Button size="sm" className="flex-1 rounded-xl text-xs bg-[#a5daeb] hover:bg-[#8ecce0] text-[#524330] font-bold h-9"
                                      onClick={() => handleStatusChange(order._id, STATUS_ORDER[STATUS_ORDER.indexOf(status) + 1], order)}>
                                      Avançar →
                                    </Button>
                                  )}
                                </div>

                                {/* Pagamento rápido */}
                                {pending > 0 && (
                                  <div className="bg-white rounded-xl border border-[#e5d5c5] p-2.5 space-y-2">
                                    <p className="text-xs text-orange-600 font-bold">A receber: R$ {pending.toFixed(2)}</p>
                                    <div className="flex gap-1.5">
                                      <Input type="number" step="0.01" placeholder="Valor"
                                        value={paymentInputs[order._id] || ""}
                                        onChange={(e) => setPaymentInputs({ ...paymentInputs, [order._id]: e.target.value })}
                                        className="flex-1 h-8 rounded-lg border-[#e5d5c5] text-xs" />
                                      <Button size="sm" onClick={() => handleAddPayment(order._id, order)}
                                        className="bg-green-500 hover:bg-green-600 text-white rounded-lg h-8 px-2.5 text-xs font-bold">
                                        <Check className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {statusOrders.length === 0 && <div className="text-center text-gray-300 text-xs py-4">Nenhum pedido</div>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Lista com filtro */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-heading font-bold text-[#524330]">Todos os Pedidos</h3>
                <input type="month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}
                  className="h-9 px-3 rounded-xl border border-[#e5d5c5] text-sm text-[#524330] bg-white" />
              </div>
              <div className="bg-white rounded-3xl border border-[#e5d5c5] shadow-sm overflow-hidden">
                {filteredOrders.length > 0 ? (
                  <div className="divide-y divide-gray-50">
                    {filteredOrders.map((order: any) => {
                      const pending = order.totalValue - order.amountPaid;
                      return (
                        <div key={order._id} className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => setSelectedOrder(order)}>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-[#524330] truncate">{order.clientName}</p>
                            <p className="text-xs text-gray-400 truncate">👶 {order.babyName}{order.theme ? ` · ${order.theme}` : ""}</p>
                          </div>
                          <span className={`text-xs font-bold px-2 py-1 rounded-full border flex-shrink-0 ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-bold text-[#524330]">R$ {order.totalValue.toFixed(2)}</p>
                            {pending > 0 ? <p className="text-xs text-orange-500">- R$ {pending.toFixed(2)}</p> : <p className="text-xs text-green-500">✅ Pago</p>}
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-10 text-center text-gray-300 italic text-sm">Nenhum pedido neste mês.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── FINANCEIRO ── */}
        {activeTab === "financial" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-heading font-bold text-[#524330]">Financeiro</h2>
              <div className="flex items-center gap-2">
                <input type="month" value={finFilterMonth} onChange={(e) => setFinFilterMonth(e.target.value)}
                  className="h-9 px-3 rounded-xl border border-[#e5d5c5] text-sm text-[#524330] bg-white" />
                <Button onClick={() => setIsAddingExpense(true)} className="bg-[#a5daeb] hover:bg-[#8ecce0] text-[#524330] font-bold rounded-full h-9 px-4 gap-1 text-xs">
                  <Plus className="w-3.5 h-3.5" /> Saída
                </Button>
              </div>
            </div>

            {/* Insights de produção */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Produção</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {metrics && Object.entries(metrics.byStatus).map(([status, count]) => (
                  <Card key={status} className="border border-[#e5d5c5] shadow-sm rounded-2xl">
                    <CardContent className="p-4 text-center">
                      <p className="text-xs text-gray-400 mb-1">{status === "Personalizacao" ? "Personalização" : status}</p>
                      <p className="text-3xl font-bold text-[#524330]">{count as number}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Insights financeiros do mês */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Financeiro — {finFilterMonth}</h3>
              {(() => {
                const monthRevenue = finFilteredOrders.reduce((s: number, o: any) => s + o.totalValue, 0);
                const monthReceived = finFilteredOrders.reduce((s: number, o: any) => s + o.amountPaid, 0);
                const monthPending = monthRevenue - monthReceived;
                const monthExpenses = finFilteredExpenses.reduce((s: number, e: any) => s + e.amount, 0);
                const monthProfit = monthReceived - monthExpenses;
                return (
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Faturamento", value: `R$ ${monthRevenue.toFixed(2)}`, color: "text-blue-600" },
                      { label: "Recebido", value: `R$ ${monthReceived.toFixed(2)}`, color: "text-green-600" },
                      { label: "A Receber", value: `R$ ${monthPending.toFixed(2)}`, color: "text-orange-500" },
                      { label: "Saídas", value: `R$ ${monthExpenses.toFixed(2)}`, color: "text-red-500" },
                      { label: "Lucro Líquido", value: `R$ ${monthProfit.toFixed(2)}`, color: monthProfit >= 0 ? "text-green-600" : "text-red-500" },
                      { label: "Pedidos", value: String(finFilteredOrders.length), color: "text-[#524330]" },
                    ].map((c) => (
                      <Card key={c.label} className="border border-[#e5d5c5] shadow-sm rounded-2xl">
                        <CardContent className="p-4">
                          <p className="text-xs text-gray-400 mb-1">{c.label}</p>
                          <p className={`text-xl font-bold ${c.color}`}>{c.value}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Pedidos do mês */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Pedidos do mês</h3>
              <div className="bg-white rounded-3xl border border-[#e5d5c5] overflow-hidden">
                {finFilteredOrders.length > 0 ? (
                  <div className="divide-y divide-gray-50">
                    {finFilteredOrders.map((order: any) => {
                      const pending = order.totalValue - order.amountPaid;
                      return (
                        <div key={order._id} className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50"
                          onClick={() => { setSelectedOrder(order); setActiveTab("orders"); }}>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-[#524330] truncate">{order.clientName} · {order.babyName}</p>
                            <p className="text-xs text-gray-400">{order.orderDate}</p>
                          </div>
                          <span className={`text-xs font-bold px-2 py-1 rounded-full border flex-shrink-0 ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-bold text-[#524330]">R$ {order.totalValue.toFixed(2)}</p>
                            {pending > 0 ? <p className="text-xs text-orange-500">- R$ {pending.toFixed(2)}</p> : <p className="text-xs text-green-500">✅ Pago</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : <div className="p-8 text-center text-gray-300 italic text-sm">Nenhum pedido neste mês.</div>}
              </div>
            </div>

            {/* Saídas do mês */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Saídas do mês</h3>
              <div className="bg-white rounded-3xl border border-[#e5d5c5] overflow-hidden">
                {finFilteredExpenses.length > 0 ? (
                  <div className="divide-y divide-gray-50">
                    {finFilteredExpenses.map((expense: any) => (
                      <div key={expense._id} className="px-4 py-3 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-[#524330] truncate">{expense.description}</p>
                          <p className="text-xs text-gray-400">{expense.category} · {expense.date}</p>
                        </div>
                        <p className="text-sm font-bold text-red-500 flex-shrink-0">- R$ {expense.amount.toFixed(2)}</p>
                        <Button variant="ghost" size="sm" onClick={() => { if (confirm("Excluir?")) deleteExpense({ id: expense._id }); }}
                          className="text-red-300 hover:text-red-500 p-1.5 rounded-xl flex-shrink-0">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : <div className="p-8 text-center text-gray-300 italic text-sm">Nenhuma saída neste mês.</div>}
              </div>
            </div>
          </div>
        )}

        {/* ── PRODUTOS ── */}
        {activeTab === "products" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-heading font-bold text-[#524330]">Produtos</h2>
              <div className="flex gap-2">
                <Button onClick={async () => { if (confirm("Importar produtos?")) { try { await seedProducts({ items: initialProducts }); alert("Importado!"); } catch(e:any){alert(e.message)} }}} variant="outline" size="sm" className="rounded-full border-[#e5d5c5] text-[#524330] text-xs h-9">Importar</Button>
                <Button onClick={() => { setEditingProduct({ id: `prod-${Date.now()}`, name: "", price: 0, category: "Geral", description: "", specs: [""], images: { main: "", gallery: [] }, whatsappMessage: "" }); setIsAddingNew(true); }}
                  className="bg-[#a5daeb] hover:bg-[#8ecce0] text-[#524330] font-bold rounded-full h-9 px-4 gap-1.5 text-sm">
                  <Plus className="w-4 h-4" /> Novo
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products?.map((product: any) => (
                <Card key={product._id} className="border border-[#e5d5c5] shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-[#fdf8f3] overflow-hidden">
                    <img src={product.images.main} alt={product.name} className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&h=200&fit=crop"; }} />
                  </div>
                  <CardContent className="p-4">
                    <p className="font-heading font-bold text-[#524330]">{product.name}</p>
                    <p className="text-sm text-gray-400">{product.category}</p>
                    <p className="text-xl font-bold text-[#a5daeb] mt-1">R$ {product.price}</p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" onClick={() => { setEditingProduct({ ...product }); setIsAddingNew(false); }}
                        className="flex-1 bg-[#a5daeb] hover:bg-[#8ecce0] text-[#524330] rounded-xl text-xs font-bold h-9 gap-1">
                        <Edit2 className="w-3 h-3" /> Editar
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => { if (confirm(`Excluir "${product.name}"?`)) { deleteProductMut({ id: product._id }); log(`Excluiu produto ${product.name}`, "-"); } }}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl h-9 px-3">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── FEED ── */}
        {activeTab === "feed" && (
          <div className="space-y-6">
            <h2 className="text-xl font-heading font-bold text-[#524330]">Feed do Instagram</h2>
            <Card className="border border-[#e5d5c5] shadow-sm rounded-3xl">
              <CardContent className="p-5 space-y-4">
                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-[#a5daeb] rounded-2xl p-5 text-center hover:bg-[#f5ebe0] transition-colors">
                    <Upload className="w-7 h-7 mx-auto mb-2 text-[#a5daeb]" />
                    <p className="text-sm font-bold text-[#524330]">Enviar foto</p>
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploadingImage} className="hidden" />
                  </div>
                </label>
                <div className="flex gap-2">
                  <Input value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} placeholder="Ou cole o link..." className="rounded-xl border-[#e5d5c5] h-11" />
                  <Button onClick={async () => { if (!instagramUrl.trim()) return; try { await addInstagramImage({ imageUrl: instagramUrl.trim(), caption: instagramCaption }); setInstagramUrl(""); setInstagramCaption(""); } catch(e:any){alert(e.message)} }} disabled={!instagramUrl.trim()} className="bg-[#a5daeb] text-[#524330] font-bold rounded-xl h-11 px-4">Add</Button>
                </div>
                <Input value={instagramCaption} onChange={(e) => setInstagramCaption(e.target.value)} placeholder="Descrição (opcional)" className="rounded-xl border-[#e5d5c5] h-11" />
              </CardContent>
            </Card>
            {instagramFeed && instagramFeed.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {instagramFeed.map((item: any) => (
                  <div key={item._id} className="relative group rounded-2xl overflow-hidden shadow-sm aspect-square">
                    <img src={item.imageUrl} alt={item.caption} className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&h=300&fit=crop"; }} />
                    <button onClick={() => { if (confirm("Remover?")) deleteInstagramImage({ id: item._id }); }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : <div className="text-center text-gray-300 py-12 italic text-sm">Nenhuma foto adicionada.</div>}
          </div>
        )}

        {/* ── HISTÓRICO ── */}
        {activeTab === "logs" && (
          <div className="space-y-4">
            <h2 className="text-xl font-heading font-bold text-[#524330]">Histórico</h2>
            <div className="bg-white rounded-3xl shadow-sm border border-[#e5d5c5] divide-y divide-gray-50">
              {logs && logs.length > 0 ? logs.map((log: any, i: number) => (
                <div key={i} className="p-4 flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#a5daeb] mt-2 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-[#524330]"><strong>{log.user}</strong> {log.action}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{log.date}{log.details ? ` · ${log.details}` : ""}</p>
                  </div>
                </div>
              )) : <div className="p-10 text-center text-gray-300 italic text-sm">Nenhuma atividade.</div>}
            </div>
          </div>
        )}
      </main>

      {/* ── MODAL DETALHES DO PEDIDO ── */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-[100]">
          <div className="w-full max-w-lg max-h-[92vh] bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <div className="h-1.5 w-12 bg-gray-200 mx-auto mt-3 rounded-full sm:hidden" />
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5d5c5]">
              <div className="min-w-0">
                <h2 className="font-heading text-lg font-bold text-[#524330] truncate">{selectedOrder.clientName}</h2>
                <p className="text-xs text-gray-400">👶 {selectedOrder.babyName}{selectedOrder.theme ? ` · ${selectedOrder.theme}` : ""} · {selectedOrder.orderDate}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button size="sm" variant="outline" onClick={() => { openEditOrder(selectedOrder); setSelectedOrder(null); }}
                  className="rounded-xl border-[#e5d5c5] text-[#524330] h-8 gap-1 text-xs px-3">
                  <Edit2 className="w-3 h-3" /> Editar
                </Button>
                <button onClick={() => setSelectedOrder(null)} className="rounded-full p-1.5 hover:bg-gray-100"><X className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 p-5 space-y-4">
              {/* Status */}
              <div className="flex flex-wrap gap-2">
                {STATUS_ORDER.map((s) => (
                  <button key={s} onClick={() => handleStatusChange(selectedOrder._id, s, selectedOrder)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${selectedOrder.status === s ? STATUS_COLORS[s] + " ring-2 ring-offset-1 ring-[#a5daeb]" : "border-gray-200 text-gray-400 hover:border-[#a5daeb]"}`}>
                    {s}
                  </button>
                ))}
              </div>

              {/* Produtos */}
              <div className="bg-[#fdf8f3] rounded-2xl p-4 space-y-2">
                <p className="text-xs font-bold text-[#524330] mb-2">🛍️ Produtos</p>
                {selectedOrder.items?.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-[#524330]">{item.quantity}x {item.productName}</span>
                    <span className="font-bold">R$ {(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                {(selectedOrder.discount || 0) > 0 && (
                  <div className="flex justify-between text-sm text-red-500">
                    <span>Desconto</span><span>- R$ {(selectedOrder.discount || 0).toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-[#e5d5c5] pt-2 flex justify-between font-bold text-[#524330]">
                  <span>Total</span><span>R$ {selectedOrder.totalValue.toFixed(2)}</span>
                </div>
              </div>

              {/* Pagamentos */}
              <div className="bg-white rounded-2xl border border-[#e5d5c5] p-4 space-y-2">
                <p className="text-xs font-bold text-[#524330]">💳 Pagamentos</p>
                {selectedOrder.payments?.length > 0 ? selectedOrder.payments.map((p: any) => (
                  <div key={p._id} className="flex justify-between items-center text-sm text-gray-600">
                    <span className="truncate text-xs">{p.note || "Pagamento"} · {p.createdAt}</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="font-bold text-green-600">+R$ {p.amount.toFixed(2)}</span>
                      <button onClick={() => handleDeletePayment(p, selectedOrder)} className="text-red-300 hover:text-red-500">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )) : <p className="text-xs text-gray-400">Nenhum pagamento registrado.</p>}

                {selectedOrder.totalValue - selectedOrder.amountPaid > 0 ? (
                  <div className="pt-2 border-t border-gray-100 space-y-2">
                    <p className="text-sm font-bold text-orange-500">A receber: R$ {(selectedOrder.totalValue - selectedOrder.amountPaid).toFixed(2)}</p>
                    <Input type="number" step="0.01" placeholder="Valor (R$)"
                      value={paymentInputs[selectedOrder._id] || ""}
                      onChange={(e) => setPaymentInputs({ ...paymentInputs, [selectedOrder._id]: e.target.value })}
                      className="h-10 rounded-xl border-[#e5d5c5] text-sm" />
                    <Input placeholder="Observação (opcional)"
                      value={paymentNotes[selectedOrder._id] || ""}
                      onChange={(e) => setPaymentNotes({ ...paymentNotes, [selectedOrder._id]: e.target.value })}
                      className="h-10 rounded-xl border-[#e5d5c5] text-sm" />
                    <div className="flex gap-2">
                      <Button onClick={() => handleAddPayment(selectedOrder._id, selectedOrder)} className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold h-10">
                        <Check className="w-4 h-4 mr-1" /> Registrar
                      </Button>
                      <Button onClick={() => handlePayFull(selectedOrder._id, selectedOrder)} className="flex-1 bg-[#524330] text-white rounded-xl text-sm font-bold h-10">
                        <CheckCheck className="w-4 h-4 mr-1" /> Pagar Tudo
                      </Button>
                    </div>
                  </div>
                ) : <p className="text-sm font-bold text-green-600 pt-1">✅ Totalmente pago!</p>}
              </div>

              {/* Obs */}
              {selectedOrder.observations && (
                <div className="bg-yellow-50 rounded-2xl p-4">
                  <p className="text-xs font-bold text-yellow-700 mb-1">Observações</p>
                  <p className="text-sm text-yellow-800">{selectedOrder.observations}</p>
                </div>
              )}

              {/* WhatsApp */}
              <div className="bg-green-50 rounded-2xl p-4 space-y-3">
                <p className="text-xs font-bold text-green-700">📱 Mensagem WhatsApp</p>
                <pre className="text-sm text-green-900 whitespace-pre-wrap font-sans leading-relaxed">{generateWhatsappText(selectedOrder)}</pre>
                <Button onClick={() => handleCopy(generateWhatsappText(selectedOrder))}
                  className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold h-10 gap-2">
                  {copied ? <><Check className="w-4 h-4" /> Copiado!</> : <><Copy className="w-4 h-4" /> Copiar mensagem</>}
                </Button>
              </div>

              {/* Telefone */}
              {selectedOrder.clientPhone && (
                <a href={`https://wa.me/55${selectedOrder.clientPhone.replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-green-600 font-semibold text-sm hover:underline">
                  <MessageCircle className="w-4 h-4" /> Abrir no WhatsApp
                </a>
              )}
            </div>
            <div className="p-5 border-t border-[#e5d5c5]">
              <Button variant="ghost" onClick={() => handleDeleteOrder(selectedOrder._id, selectedOrder)}
                className="w-full text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl text-sm">
                <Trash2 className="w-4 h-4 mr-2" /> Excluir Pedido
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CRIAR PEDIDO ── */}
      {isCreatingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-[100]">
          <div className="w-full max-w-2xl max-h-[92vh] bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <div className="h-1.5 w-12 bg-gray-200 mx-auto mt-3 rounded-full sm:hidden" />
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5d5c5]">
              <h2 className="font-heading text-lg font-bold text-[#524330]">✨ Novo Pedido</h2>
              <button onClick={() => setIsCreatingOrder(false)} className="rounded-full p-1.5 hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#524330]">👩 Cliente *</label>
                  <Input value={newOrder.clientName} onChange={(e) => setNewOrder({ ...newOrder, clientName: e.target.value })} className="h-12 rounded-2xl border-[#e5d5c5]" placeholder="Maria Silva" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#524330]">📞 Telefone</label>
                  <Input value={newOrder.clientPhone} onChange={(e) => setNewOrder({ ...newOrder, clientPhone: e.target.value })} className="h-12 rounded-2xl border-[#e5d5c5]" placeholder="(27) 99999-9999" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#524330]">👶 Bebê *</label>
                  <Input value={newOrder.babyName} onChange={(e) => setNewOrder({ ...newOrder, babyName: e.target.value })} className="h-12 rounded-2xl border-[#e5d5c5]" placeholder="João" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#524330]">🎨 Tema</label>
                  <Input value={newOrder.theme} onChange={(e) => setNewOrder({ ...newOrder, theme: e.target.value })} className="h-12 rounded-2xl border-[#e5d5c5]" placeholder="Ursinhos..." />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#524330]">📅 Data do Pedido</label>
                <Input type="date" value={newOrder.orderDate} onChange={(e) => setNewOrder({ ...newOrder, orderDate: e.target.value })} className="h-12 rounded-2xl border-[#e5d5c5]" />
              </div>

              <OrderItemsForm
                items={newOrder.items}
                setItems={(items: any[]) => setNewOrder({ ...newOrder, items })}
                discount={newOrder.discount}
                setDiscount={(d: string) => setNewOrder({ ...newOrder, discount: d })}
              />

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#524330]">💳 Entrada / Sinal</label>
                <Input type="number" step="0.01" value={newOrder.initialPayment} onChange={(e) => setNewOrder({ ...newOrder, initialPayment: e.target.value })} className="h-12 rounded-2xl border-[#e5d5c5]" placeholder="R$ 0,00" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#524330]">📝 Observações</label>
                <textarea value={newOrder.observations} onChange={(e) => setNewOrder({ ...newOrder, observations: e.target.value })}
                  className="w-full min-h-[70px] p-3 rounded-2xl border border-[#e5d5c5] text-sm outline-none focus:ring-2 focus:ring-[#a5daeb]" placeholder="Detalhes extras..." />
              </div>
            </div>
            <div className="p-5 border-t border-[#e5d5c5] space-y-2">
              <Button onClick={handleCreateOrder} className="w-full h-13 rounded-2xl text-base font-bold text-[#524330] bg-[#a5daeb] hover:bg-[#8ecce0] h-12">✅ Criar Pedido</Button>
              <Button variant="ghost" onClick={() => setIsCreatingOrder(false)} className="w-full h-11 text-gray-400 text-sm">Cancelar</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL EDITAR PEDIDO ── */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-[100]">
          <div className="w-full max-w-2xl max-h-[92vh] bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <div className="h-1.5 w-12 bg-gray-200 mx-auto mt-3 rounded-full sm:hidden" />
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5d5c5]">
              <h2 className="font-heading text-lg font-bold text-[#524330]">✏️ Editar Pedido</h2>
              <button onClick={() => setEditingOrder(null)} className="rounded-full p-1.5 hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#524330]">👩 Cliente *</label>
                  <Input value={editingOrder.clientName} onChange={(e) => setEditingOrder({ ...editingOrder, clientName: e.target.value })} className="h-12 rounded-2xl border-[#e5d5c5]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#524330]">📞 Telefone</label>
                  <Input value={editingOrder.clientPhone || ""} onChange={(e) => setEditingOrder({ ...editingOrder, clientPhone: e.target.value })} className="h-12 rounded-2xl border-[#e5d5c5]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#524330]">👶 Bebê *</label>
                  <Input value={editingOrder.babyName} onChange={(e) => setEditingOrder({ ...editingOrder, babyName: e.target.value })} className="h-12 rounded-2xl border-[#e5d5c5]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#524330]">🎨 Tema</label>
                  <Input value={editingOrder.theme} onChange={(e) => setEditingOrder({ ...editingOrder, theme: e.target.value })} className="h-12 rounded-2xl border-[#e5d5c5]" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#524330]">📅 Data do Pedido</label>
                <Input type="date" value={editingOrder.orderDate || ""} onChange={(e) => setEditingOrder({ ...editingOrder, orderDate: e.target.value })} className="h-12 rounded-2xl border-[#e5d5c5]" />
              </div>
              <OrderItemsForm
                items={editingOrder.items}
                setItems={(items: any[]) => setEditingOrder({ ...editingOrder, items })}
                discount={editingOrder.discount}
                setDiscount={(d: string) => setEditingOrder({ ...editingOrder, discount: d })}
              />
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#524330]">📝 Observações</label>
                <textarea value={editingOrder.observations || ""} onChange={(e) => setEditingOrder({ ...editingOrder, observations: e.target.value })}
                  className="w-full min-h-[70px] p-3 rounded-2xl border border-[#e5d5c5] text-sm outline-none focus:ring-2 focus:ring-[#a5daeb]" />
              </div>
            </div>
            <div className="p-5 border-t border-[#e5d5c5] space-y-2">
              <Button onClick={handleUpdateOrder} className="w-full h-12 rounded-2xl text-base font-bold text-[#524330] bg-[#a5daeb] hover:bg-[#8ecce0]">
                <Save className="w-4 h-4 mr-2" /> Salvar Alterações
              </Button>
              <Button variant="ghost" onClick={() => setEditingOrder(null)} className="w-full h-11 text-gray-400 text-sm">Cancelar</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL SAÍDA ── */}
      {isAddingExpense && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-[100]">
          <div className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl overflow-hidden">
            <div className="h-1.5 w-12 bg-gray-200 mx-auto mt-3 rounded-full sm:hidden" />
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5d5c5]">
              <h2 className="font-heading text-lg font-bold text-[#524330]">💸 Nova Saída</h2>
              <button onClick={() => setIsAddingExpense(false)} className="rounded-full p-1.5 hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#524330]">Descrição *</label>
                <Input value={newExpense.description} onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })} className="h-12 rounded-2xl border-[#e5d5c5]" placeholder="Ex: Tecido algodão branco" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#524330]">Categoria</label>
                  <select value={newExpense.category} onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    className="w-full h-12 rounded-2xl border border-[#e5d5c5] text-sm text-[#524330] px-3 bg-white">
                    {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#524330]">Valor *</label>
                  <Input type="number" step="0.01" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} className="h-12 rounded-2xl border-[#e5d5c5] font-bold text-red-500" placeholder="0,00" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#524330]">Data</label>
                <Input type="date" value={newExpense.date} onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })} className="h-12 rounded-2xl border-[#e5d5c5]" />
              </div>
            </div>
            <div className="p-5 border-t border-[#e5d5c5] space-y-2">
              <Button onClick={handleAddExpense} className="w-full h-12 rounded-2xl text-base font-bold text-[#524330] bg-[#a5daeb] hover:bg-[#8ecce0]">✅ Registrar</Button>
              <Button variant="ghost" onClick={() => setIsAddingExpense(false)} className="w-full h-11 text-gray-400 text-sm">Cancelar</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL EDITAR PRODUTO ── */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-[100]">
          <div className="w-full max-w-2xl max-h-[92vh] bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <div className="h-1.5 w-12 bg-gray-200 mx-auto mt-3 rounded-full sm:hidden" />
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5d5c5]">
              <h2 className="font-heading text-lg font-bold text-[#524330]">{isAddingNew ? "Novo Produto" : "Editar Produto"}</h2>
              <button onClick={() => setEditingProduct(null)} className="rounded-full p-1.5 hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-5 space-y-4">
              <div className="flex flex-col items-center gap-3">
                <img src={editingProduct.images.main} className="w-28 h-28 rounded-2xl object-cover shadow-md"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&h=200&fit=crop"; }} />
                <label className="w-full max-w-xs cursor-pointer">
                  <div className="border-2 border-dashed border-[#a5daeb] rounded-2xl p-3 text-center hover:bg-[#f5ebe0] transition-colors">
                    <Upload className="w-5 h-5 mx-auto mb-1 text-[#a5daeb]" />
                    <p className="text-xs font-bold text-[#524330]">Enviar foto</p>
                    <input type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0]; if (!file) return;
                      setIsUploadingImage(true);
                      const reader = new FileReader();
                      reader.onload = (ev) => { setEditingProduct({ ...editingProduct, images: { ...editingProduct.images, main: ev.target?.result as string } }); setIsUploadingImage(false); };
                      reader.readAsDataURL(file);
                    }} disabled={isUploadingImage} className="hidden" />
                  </div>
                </label>
                <Input value={editingProduct.images.main} onChange={(e) => setEditingProduct({ ...editingProduct, images: { ...editingProduct.images, main: e.target.value } })}
                  className="h-10 rounded-xl border-[#e5d5c5] text-sm w-full" placeholder="URL da imagem" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#524330]">Nome</label>
                <Input value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} className="h-12 rounded-2xl border-[#e5d5c5]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#524330]">Preço (R$)</label>
                  <Input type="number" step="0.01" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })} className="h-12 rounded-2xl border-[#e5d5c5] font-bold" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#524330]">Categoria</label>
                  <Input value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} className="h-12 rounded-2xl border-[#e5d5c5]" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#524330]">Descrição</label>
                <textarea className="w-full min-h-[70px] p-3 rounded-2xl border border-[#e5d5c5] text-sm outline-none focus:ring-2 focus:ring-[#a5daeb]"
                  value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-[#524330]">Especificações</label>
                  <Button onClick={() => setEditingProduct({ ...editingProduct, specs: [...editingProduct.specs, ""] })} variant="outline" size="sm" className="rounded-full h-7 px-3 text-xs border-[#a5daeb] text-[#524330]">
                    <Plus className="w-3 h-3 mr-1" /> Add
                  </Button>
                </div>
                {editingProduct.specs.map((spec: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <Input value={spec} onChange={(e) => { const s = [...editingProduct.specs]; s[index] = e.target.value; setEditingProduct({ ...editingProduct, specs: s }); }}
                      className="h-10 rounded-xl border-[#e5d5c5] text-sm" placeholder="Ex: 100% Algodão" />
                    <Button onClick={() => setEditingProduct({ ...editingProduct, specs: editingProduct.specs.filter((_: any, i: number) => i !== index) })} variant="ghost" size="sm" className="text-red-400 p-2"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-5 border-t border-[#e5d5c5] space-y-2">
              <Button onClick={handleSaveProduct} disabled={isSaving} className="w-full h-12 rounded-2xl text-base font-bold text-[#524330] bg-[#a5daeb] hover:bg-[#8ecce0]">
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                {isAddingNew ? "Criar Produto" : "Salvar"}
              </Button>
              <Button variant="ghost" onClick={() => setEditingProduct(null)} className="w-full h-11 text-gray-400 text-sm">Cancelar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
