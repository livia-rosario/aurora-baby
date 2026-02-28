import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LogOut, Edit, Save, X, Loader2, History, Plus, Trash2, Image as ImageIcon,
  Upload, ShoppingBag, LayoutDashboard, TrendingDown, TrendingUp, Package,
  ChevronRight, CheckCheck, DollarSign, Clock, Check,
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

type Tab = "orders" | "products" | "feed" | "expenses" | "financial" | "logs";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("orders");

  // Queries
  const products = useQuery(api.aurora.getProducts);
  const logs = useQuery(api.aurora.getLogs);
  const instagramFeed = useQuery(api.aurora.getInstagramFeed);
  const orders = useQuery(api.aurora.getOrders);
  const expenses = useQuery(api.aurora.getExpenses);
  const metrics = useQuery(api.aurora.getOrderMetrics);

  // Mutations - Produtos
  const updateProduct = useMutation(api.aurora.updateProduct);
  const addProduct = useMutation(api.aurora.addProduct);
  const deleteProduct = useMutation(api.aurora.deleteProduct);
  const addLog = useMutation(api.aurora.addLog);
  const seedProducts = useMutation(api.aurora.seedProducts);

  // Mutations - Instagram
  const addInstagramImage = useMutation(api.aurora.addInstagramImage);
  const deleteInstagramImage = useMutation(api.aurora.deleteInstagramImage);
  const seedInstagramFeed = useMutation(api.aurora.seedInstagramFeed);

  // Mutations - Pedidos
  const createOrder = useMutation(api.aurora.createOrder);
  const updateOrderStatus = useMutation(api.aurora.updateOrderStatus);
  const deleteOrder = useMutation(api.aurora.deleteOrder);
  const addPayment = useMutation(api.aurora.addPayment);
  const payOrderFull = useMutation(api.aurora.payOrderFull);

  // Mutations - Despesas
  const addExpense = useMutation(api.aurora.addExpense);
  const deleteExpense = useMutation(api.aurora.deleteExpense);

  // Estados - Produtos
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Estados - Instagram
  const [instagramUrl, setInstagramUrl] = useState("");
  const [instagramCaption, setInstagramCaption] = useState("");

  // Estados - Pedidos
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [paymentInputs, setPaymentInputs] = useState<Record<string, string>>({});
  const [paymentNotes, setPaymentNotes] = useState<Record<string, string>>({});
  const [newOrder, setNewOrder] = useState({
    clientName: "", clientPhone: "", babyName: "", theme: "",
    observations: "", items: [] as { productId: string; productName: string; quantity: number; unitPrice: number }[],
    initialPayment: "",
  });
  const [orderProductSelect, setOrderProductSelect] = useState("");
  const [orderProductQty, setOrderProductQty] = useState(1);

  // Estados - Despesas
  const [newExpense, setNewExpense] = useState({ description: "", category: "Tecido", amount: "", date: new Date().toISOString().split("T")[0] });
  const [isAddingExpense, setIsAddingExpense] = useState(false);

  useEffect(() => {
    const savedUser = sessionStorage.getItem("admin_user");
    if (savedUser) { setIsLoggedIn(true); setCurrentUser(savedUser); }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = USERS.find(u => u.username === username.toLowerCase() && u.password === password);
    if (user) {
      setIsLoggedIn(true); setCurrentUser(user.name);
      sessionStorage.setItem("admin_user", user.name); setError("");
    } else { setError("Usuário ou senha incorretos."); }
  };

  const handleLogout = () => { setIsLoggedIn(false); sessionStorage.removeItem("admin_user"); };

  // ── Produtos ──
  const handleSeed = async () => {
    if (confirm("Importar produtos do JSON para o banco?")) {
      try { await seedProducts({ items: initialProducts }); alert("Importado!"); }
      catch (err: any) { alert("Erro: " + err.message); }
    }
  };

  const handleEdit = (product: any) => { setEditingProduct({ ...product }); setIsAddingNew(false); };
  const handleAddNew = () => {
    setEditingProduct({ id: `prod-${Date.now()}`, name: "", price: 0, category: "Geral", description: "", specs: [""], images: { main: "", gallery: [] }, whatsappMessage: "" });
    setIsAddingNew(true);
  };
  const handleDelete = async (id: any, name: string) => {
    if (confirm(`Excluir "${name}"?`)) {
      try {
        await deleteProduct({ id });
        await addLog({ user: currentUser, action: `Excluiu o produto ${name}`, details: "-", date: new Date().toLocaleString("pt-BR") });
      } catch (err: any) { alert("Erro: " + err.message); }
    }
  };
  const handleSpecChange = (index: number, value: string) => {
    const s = [...editingProduct.specs]; s[index] = value; setEditingProduct({ ...editingProduct, specs: s });
  };
  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setIsUploadingImage(true);
    const reader = new FileReader();
    reader.onload = (ev) => { setEditingProduct({ ...editingProduct, images: { ...editingProduct.images, main: ev.target?.result as string } }); setIsUploadingImage(false); };
    reader.readAsDataURL(file);
  };
  const handleSaveProduct = async () => {
    if (!editingProduct.name || editingProduct.price <= 0) { alert("Preencha nome e preço!"); return; }
    setIsSaving(true);
    try {
      if (isAddingNew) {
        await addProduct({ id: editingProduct.id, name: editingProduct.name, price: editingProduct.price, category: editingProduct.category, description: editingProduct.description, specs: editingProduct.specs.filter((s: string) => s.trim()), images: editingProduct.images, whatsappMessage: editingProduct.whatsappMessage || "" });
        await addLog({ user: currentUser, action: `Criou o produto ${editingProduct.name}`, details: `R$ ${editingProduct.price}`, date: new Date().toLocaleString("pt-BR") });
      } else {
        await updateProduct({ id: editingProduct._id, name: editingProduct.name, price: editingProduct.price, category: editingProduct.category, description: editingProduct.description, specs: editingProduct.specs.filter((s: string) => s.trim()), whatsappMessage: editingProduct.whatsappMessage });
        await addLog({ user: currentUser, action: `Editou o produto ${editingProduct.name}`, details: `R$ ${editingProduct.price}`, date: new Date().toLocaleString("pt-BR") });
      }
      setEditingProduct(null);
    } catch (err: any) { alert("Erro: " + err.message); }
    finally { setIsSaving(false); }
  };

  // ── Instagram ──
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
  const handleAddInstagramUrl = async () => {
    if (!instagramUrl.trim()) return;
    try { await addInstagramImage({ imageUrl: instagramUrl.trim(), caption: instagramCaption }); setInstagramUrl(""); setInstagramCaption(""); }
    catch (err: any) { alert("Erro: " + err.message); }
  };
  const handleSeedInstagram = async () => {
    const oldImages = Array.from({ length: 15 }, (_, i) => `/images/instagram/ig-${i + 1}.png`);
    if (confirm("Importar fotos antigas?")) {
      try { await seedInstagramFeed({ images: oldImages }); alert("Importado!"); }
      catch (err: any) { alert("Erro: " + err.message); }
    }
  };

  // ── Pedidos ──
  const addProductToOrder = () => {
    const product = products?.find((p: any) => p.id === orderProductSelect);
    if (!product) return;
    const existing = newOrder.items.find(i => i.productId === product.id);
    if (existing) {
      setNewOrder({ ...newOrder, items: newOrder.items.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + orderProductQty } : i) });
    } else {
      setNewOrder({ ...newOrder, items: [...newOrder.items, { productId: product.id, productName: product.name, quantity: orderProductQty, unitPrice: product.price }] });
    }
    setOrderProductSelect(""); setOrderProductQty(1);
  };
  const removeProductFromOrder = (productId: string) => {
    setNewOrder({ ...newOrder, items: newOrder.items.filter(i => i.productId !== productId) });
  };
  const orderTotal = newOrder.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  const handleCreateOrder = async () => {
    if (!newOrder.clientName || !newOrder.babyName || newOrder.items.length === 0) {
      alert("Preencha nome da cliente, nome do bebê e adicione pelo menos um produto!"); return;
    }
    try {
      await createOrder({
        clientName: newOrder.clientName,
        clientPhone: newOrder.clientPhone,
        babyName: newOrder.babyName,
        theme: newOrder.theme,
        items: newOrder.items,
        observations: newOrder.observations,
        initialPayment: parseFloat(newOrder.initialPayment) || 0,
      });
      setNewOrder({ clientName: "", clientPhone: "", babyName: "", theme: "Customizado", observations: "", items: [], initialPayment: "" });
      setIsCreatingOrder(false);
    } catch (err: any) { alert("Erro: " + err.message); }
  };

  const handleStatusChange = async (orderId: any, newStatus: string, assignedTo: string) => {
    try { await updateOrderStatus({ orderId, status: newStatus, assignedTo }); }
    catch (err: any) { alert("Erro: " + err.message); }
  };

  const handleAddPayment = async (orderId: any) => {
    const amount = parseFloat(paymentInputs[orderId] || "0");
    if (!amount || amount <= 0) { alert("Digite um valor válido!"); return; }
    try {
      await addPayment({ orderId, amount, note: paymentNotes[orderId] || "" });
      setPaymentInputs({ ...paymentInputs, [orderId]: "" });
      setPaymentNotes({ ...paymentNotes, [orderId]: "" });
    } catch (err: any) { alert(err.message); }
  };

  const handlePayFull = async (orderId: any) => {
    if (confirm("Marcar como pago totalmente?")) {
      try { await payOrderFull({ orderId }); }
      catch (err: any) { alert("Erro: " + err.message); }
    }
  };

  const handleDeleteOrder = async (orderId: any) => {
    if (confirm("Excluir este pedido?")) {
      try { await deleteOrder({ orderId }); }
      catch (err: any) { alert("Erro: " + err.message); }
    }
  };

  // ── Despesas ──
  const handleAddExpense = async () => {
    if (!newExpense.description || !newExpense.amount || parseFloat(newExpense.amount) <= 0) {
      alert("Preencha descrição e valor!"); return;
    }
    try {
      await addExpense({ description: newExpense.description, category: newExpense.category, amount: parseFloat(newExpense.amount), date: newExpense.date });
      setNewExpense({ description: "", category: "Tecido", amount: "", date: new Date().toISOString().split("T")[0] });
      setIsAddingExpense(false);
    } catch (err: any) { alert("Erro: " + err.message); }
  };

  // ── Login Screen ──
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "var(--base-bg)" }}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <img src="/images/logo.png" alt="Aurora Baby" className="h-20 mx-auto mb-4" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <h1 className="font-heading text-3xl font-bold" style={{ color: "var(--soft-brown)" }}>Área Admin</h1>
            <p className="text-sm mt-1" style={{ color: "rgba(82,67,48,0.6)" }}>Aurora Baby Boutique</p>
          </div>
          <form onSubmit={handleLogin} className="bg-white rounded-3xl shadow-xl p-8 space-y-4 border" style={{ borderColor: "rgba(82,67,48,0.08)" }}>
            <div className="space-y-2">
              <label className="text-sm font-bold" style={{ color: "var(--soft-brown)" }}>Usuário</label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} className="h-14 rounded-2xl text-lg border-[#e5d5c5]" placeholder="seu usuário" autoComplete="username" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold" style={{ color: "var(--soft-brown)" }}>Senha</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-14 rounded-2xl text-lg border-[#e5d5c5]" placeholder="••••••••" autoComplete="current-password" />
            </div>
            {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
            <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold text-white" style={{ backgroundColor: "var(--accent-blue)" }}>Entrar</Button>
          </form>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "orders", label: "Pedidos", icon: <ShoppingBag className="w-4 h-4" /> },
    { key: "financial", label: "Financeiro", icon: <LayoutDashboard className="w-4 h-4" /> },
    { key: "expenses", label: "Saídas", icon: <TrendingDown className="w-4 h-4" /> },
    { key: "products", label: "Produtos", icon: <Package className="w-4 h-4" /> },
    { key: "feed", label: "Feed", icon: <ImageIcon className="w-4 h-4" /> },
    { key: "logs", label: "Histórico", icon: <History className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#fdf8f3]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-[#e5d5c5]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Aurora Baby" className="h-10 w-auto" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <div>
              <p className="font-heading font-bold text-[#524330] leading-none">Aurora Baby</p>
              <p className="text-xs text-gray-400">Olá, {currentUser}!</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="ghost" className="text-gray-400 hover:text-red-400 rounded-full gap-2">
            <LogOut className="w-4 h-4" /> Sair
          </Button>
        </div>
        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto pb-0 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.key ? "border-[#a5daeb] text-[#524330]" : "border-transparent text-gray-400 hover:text-[#524330]"}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">

        {/* ── ABA PEDIDOS (KANBAN) ── */}
        {activeTab === "orders" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-heading font-bold text-[#524330]">Pedidos</h2>
              <Button onClick={() => setIsCreatingOrder(true)} className="bg-[#a5daeb] hover:bg-[#8ecce0] text-[#524330] font-bold rounded-full h-11 px-5 gap-2">
                <Plus className="w-4 h-4" /> Novo Pedido
              </Button>
            </div>

            {/* Kanban */}
            <div className="flex gap-4 overflow-x-auto pb-6">
              {STATUS_ORDER.map((status) => {
                const statusOrders = orders?.filter((o: any) => o.status === status) || [];
                return (
                  <div key={status} className={`flex-shrink-0 w-72 rounded-2xl border p-3 ${STATUS_BG[status]}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${STATUS_COLORS[status]}`}>{status}</span>
                      <span className="text-xs font-bold text-gray-400 bg-white rounded-full w-6 h-6 flex items-center justify-center">{statusOrders.length}</span>
                    </div>

                    <div className="space-y-3">
                      {statusOrders.map((order: any) => {
                        const pending = order.totalValue - order.amountPaid;
                        const paidPct = Math.round((order.amountPaid / order.totalValue) * 100);
                        const isExpanded = expandedOrder === order._id;

                        return (
                          <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-white/80 overflow-hidden">
                            <div className="p-4 cursor-pointer" onClick={() => setExpandedOrder(isExpanded ? null : order._id)}>
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-bold text-[#524330] text-sm">{order.clientName}</p>
                                  <p className="text-xs text-gray-400">👶 {order.babyName} · {order.theme}</p>
                                </div>
                                <ChevronRight className={`w-4 h-4 text-gray-300 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                              </div>

                              {order.items?.length > 0 && (
                                <div className="mt-2 space-y-0.5">
                                  {order.items.map((item: any, i: number) => (
                                    <p key={i} className="text-xs text-gray-500">{item.quantity}x {item.productName}</p>
                                  ))}
                                </div>
                              )}

                              <div className="mt-3">
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-400">Pago: R$ {order.amountPaid.toFixed(2)}</span>
                                  <span className="font-bold text-[#524330]">R$ {order.totalValue.toFixed(2)}</span>
                                </div>
                                <div className="h-1.5 bg-gray-100 rounded-full">
                                  <div className="h-1.5 rounded-full bg-green-400 transition-all" style={{ width: `${paidPct}%` }} />
                                </div>
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="border-t border-gray-50 p-4 space-y-3 bg-gray-50/50">
                                {/* Atribuir */}
                                <div>
                                  <p className="text-xs font-bold text-gray-400 mb-1.5">RESPONSÁVEL</p>
                                  <select
                                    value={order.assignedTo || ""}
                                    onChange={(e) => handleStatusChange(order._id, order.status, e.target.value)}
                                    className="w-full text-sm p-2 rounded-xl border border-[#e5d5c5] bg-white text-[#524330] font-semibold"
                                  >
                                    <option value="">Ninguém</option>
                                    <option value="Miriam">Miriam</option>
                                    <option value="Denize">Denize</option>
                                    <option value="Lívia">Lívia</option>
                                  </select>
                                </div>

                                {/* Avançar status */}
                                <div className="flex gap-2">
                                  {STATUS_ORDER.indexOf(status) > 0 && (
                                    <Button size="sm" variant="outline" className="flex-1 rounded-xl text-xs border-[#e5d5c5]"
                                      onClick={() => handleStatusChange(order._id, STATUS_ORDER[STATUS_ORDER.indexOf(status) - 1], order.assignedTo || "")}>
                                      ← Voltar
                                    </Button>
                                  )}
                                  {STATUS_ORDER.indexOf(status) < STATUS_ORDER.length - 1 && (
                                    <Button size="sm" className="flex-1 rounded-xl text-xs bg-[#a5daeb] hover:bg-[#8ecce0] text-[#524330] font-bold"
                                      onClick={() => handleStatusChange(order._id, STATUS_ORDER[STATUS_ORDER.indexOf(status) + 1], order.assignedTo || "")}>
                                      Avançar →
                                    </Button>
                                  )}
                                </div>

                                {/* Observações */}
                                {order.observations && (
                                  <div className="bg-yellow-50 rounded-xl p-3">
                                    <p className="text-xs font-bold text-yellow-700 mb-1">Obs:</p>
                                    <p className="text-xs text-yellow-800">{order.observations}</p>
                                  </div>
                                )}

                                {/* Pagamentos */}
                                <div className="bg-white rounded-xl border border-[#e5d5c5] p-3 space-y-2">
                                  <p className="text-xs font-bold text-[#524330]">💳 Pagamentos</p>
                                  {order.payments?.map((p: any, i: number) => (
                                    <div key={i} className="flex justify-between text-xs text-gray-600">
                                      <span>{p.note || "Pagamento"} · {p.createdAt}</span>
                                      <span className="font-bold text-green-600">+R$ {p.amount.toFixed(2)}</span>
                                    </div>
                                  ))}
                                  {pending > 0 ? (
                                    <div className="space-y-2 pt-2 border-t border-gray-100">
                                      <p className="text-xs text-orange-600 font-bold">A receber: R$ {pending.toFixed(2)}</p>
                                      <Input
                                        type="number" step="0.01" placeholder="Valor (R$)"
                                        value={paymentInputs[order._id] || ""}
                                        onChange={(e) => setPaymentInputs({ ...paymentInputs, [order._id]: e.target.value })}
                                        className="h-9 rounded-xl border-[#e5d5c5] text-xs"
                                      />
                                      <Input
                                        placeholder="Observação (opcional)"
                                        value={paymentNotes[order._id] || ""}
                                        onChange={(e) => setPaymentNotes({ ...paymentNotes, [order._id]: e.target.value })}
                                        className="h-9 rounded-xl border-[#e5d5c5] text-xs"
                                      />
                                      <div className="flex gap-2">
                                        <Button size="sm" onClick={() => handleAddPayment(order._id)} className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-bold h-9">
                                          <Check className="w-3 h-3 mr-1" /> Registrar
                                        </Button>
                                        <Button size="sm" onClick={() => handlePayFull(order._id)} className="flex-1 bg-[#524330] text-white rounded-xl text-xs font-bold h-9">
                                          <CheckCheck className="w-3 h-3 mr-1" /> Pagar Tudo
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-xs text-green-600 font-bold">✅ Pago!</p>
                                  )}
                                </div>

                                {/* Excluir */}
                                <Button size="sm" variant="ghost" onClick={() => handleDeleteOrder(order._id)} className="w-full text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl text-xs">
                                  <Trash2 className="w-3 h-3 mr-1" /> Excluir Pedido
                                </Button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {statusOrders.length === 0 && (
                        <div className="text-center text-gray-300 text-xs py-6">Nenhum pedido aqui</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── ABA FINANCEIRO ── */}
        {activeTab === "financial" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-bold text-[#524330]">Dashboard Financeiro</h2>
            {metrics ? (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Total de Pedidos", value: metrics.totalOrders, color: "text-[#524330]", prefix: "" },
                    { label: "Faturamento Total", value: metrics.totalRevenue.toFixed(2), color: "text-blue-600", prefix: "R$ " },
                    { label: "Recebido", value: metrics.totalReceived.toFixed(2), color: "text-green-600", prefix: "R$ " },
                    { label: "A Receber", value: metrics.totalPending.toFixed(2), color: "text-orange-500", prefix: "R$ " },
                    { label: "Total de Saídas", value: metrics.totalExpenses.toFixed(2), color: "text-red-500", prefix: "R$ " },
                    { label: "Lucro Líquido", value: metrics.netProfit.toFixed(2), color: metrics.netProfit >= 0 ? "text-green-600" : "text-red-500", prefix: "R$ " },
                    { label: "Pedidos Entregues", value: metrics.deliveredOrders, color: "text-gray-600", prefix: "" },
                  ].map((card) => (
                    <Card key={card.label} className="border-none shadow-md rounded-3xl">
                      <CardContent className="p-6 text-center">
                        <p className="text-xs text-gray-400 font-semibold mb-2">{card.label}</p>
                        <p className={`text-3xl font-bold ${card.color}`}>{card.prefix}{card.value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Lista de pedidos resumida */}
                <div className="bg-white rounded-3xl shadow-md border border-[#e5d5c5] overflow-hidden">
                  <div className="p-5 border-b border-[#e5d5c5]">
                    <h3 className="font-heading font-bold text-[#524330]">Situação dos Pedidos</h3>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {orders?.map((order: any) => {
                      const pending = order.totalValue - order.amountPaid;
                      return (
                        <div key={order._id} className="px-5 py-4 flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-[#524330] truncate">{order.clientName} · {order.babyName}</p>
                            <p className="text-xs text-gray-400">{order.createdAt}</p>
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
                </div>
              </>
            ) : <p className="text-gray-400 text-center py-20">Carregando...</p>}
          </div>
        )}

        {/* ── ABA SAÍDAS ── */}
        {activeTab === "expenses" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-heading font-bold text-[#524330]">Saídas & Compras</h2>
              <Button onClick={() => setIsAddingExpense(true)} className="bg-[#a5daeb] hover:bg-[#8ecce0] text-[#524330] font-bold rounded-full h-11 px-5 gap-2">
                <Plus className="w-4 h-4" /> Registrar Saída
              </Button>
            </div>

            <div className="bg-white rounded-3xl shadow-md border border-[#e5d5c5] overflow-hidden">
              {expenses && expenses.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {expenses.map((expense: any) => (
                    <div key={expense._id} className="px-5 py-4 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-[#524330] truncate">{expense.description}</p>
                        <p className="text-xs text-gray-400">{expense.category} · {expense.date}</p>
                      </div>
                      <p className="text-base font-bold text-red-500 flex-shrink-0">- R$ {expense.amount.toFixed(2)}</p>
                      <Button variant="ghost" size="sm" onClick={() => { if (confirm("Excluir esta saída?")) deleteExpense({ id: expense._id }); }} className="text-red-300 hover:text-red-500 p-2 rounded-xl">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-300 italic">Nenhuma saída registrada ainda.</div>
              )}
            </div>
          </div>
        )}

        {/* ── ABA PRODUTOS ── */}
        {activeTab === "products" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-heading font-bold text-[#524330]">Produtos</h2>
              <div className="flex gap-2">
                <Button onClick={handleSeed} variant="outline" size="sm" className="rounded-full border-[#e5d5c5] text-[#524330] text-xs gap-1">
                  Importar JSON
                </Button>
                <Button onClick={handleAddNew} className="bg-[#a5daeb] hover:bg-[#8ecce0] text-[#524330] font-bold rounded-full h-11 px-5 gap-2">
                  <Plus className="w-4 h-4" /> Novo Produto
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products?.map((product: any) => (
                <Card key={product._id} className="border border-[#e5d5c5] shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-[#fdf8f3] flex items-center justify-center overflow-hidden">
                    <img src={product.images.main} alt={product.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&h=200&fit=crop"; }} />
                  </div>
                  <CardContent className="p-4">
                    <p className="font-heading font-bold text-[#524330]">{product.name}</p>
                    <p className="text-sm text-gray-400">{product.category}</p>
                    <p className="text-xl font-bold text-[#a5daeb] mt-1">R$ {product.price}</p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" onClick={() => handleEdit(product)} className="flex-1 bg-[#a5daeb] hover:bg-[#8ecce0] text-[#524330] rounded-xl text-xs font-bold h-9 gap-1">
                        <Edit className="w-3 h-3" /> Editar
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(product._id, product.name)} className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl h-9 px-3">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── ABA FEED ── */}
        {activeTab === "feed" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-heading font-bold text-[#524330]">Feed do Instagram</h2>
              <Button onClick={handleSeedInstagram} variant="outline" size="sm" className="rounded-full border-[#e5d5c5] text-[#524330] text-xs">Importar Antigas</Button>
            </div>

            <Card className="border border-[#e5d5c5] shadow-sm rounded-3xl">
              <CardContent className="p-6 space-y-4">
                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-[#a5daeb] rounded-2xl p-6 text-center hover:bg-[#f5ebe0] transition-colors">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-[#a5daeb]" />
                    <p className="text-sm font-bold text-[#524330]">Enviar foto do dispositivo</p>
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploadingImage} className="hidden" />
                  </div>
                </label>

                <div className="flex gap-2">
                  <Input value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} placeholder="Ou cole o link da imagem..." className="rounded-xl border-[#e5d5c5] h-11" />
                  <Button onClick={handleAddInstagramUrl} disabled={!instagramUrl.trim()} className="bg-[#a5daeb] text-[#524330] font-bold rounded-xl h-11 px-4">Adicionar</Button>
                </div>

                <Input value={instagramCaption} onChange={(e) => setInstagramCaption(e.target.value)} placeholder="Descrição (opcional)" className="rounded-xl border-[#e5d5c5] h-11" />
              </CardContent>
            </Card>

            {instagramFeed && instagramFeed.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {instagramFeed.map((item: any) => (
                  <div key={item._id} className="relative group rounded-2xl overflow-hidden shadow-sm">
                    <img src={item.imageUrl} alt={item.caption} className="w-full aspect-square object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&h=300&fit=crop"; }} />
                    <button onClick={() => { if (confirm("Remover foto?")) deleteInstagramImage({ id: item._id }); }} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-300 py-16 italic">Nenhuma foto adicionada ainda.</div>
            )}
          </div>
        )}

        {/* ── ABA HISTÓRICO ── */}
        {activeTab === "logs" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-[#524330]">Histórico de Alterações</h2>
            <div className="bg-white rounded-3xl shadow-sm border border-[#e5d5c5] divide-y divide-gray-50">
              {logs && logs.length > 0 ? logs.map((log: any, i: number) => (
                <div key={i} className="p-4 flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#a5daeb] mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-[#524330]"><strong>{log.user}</strong> {log.action}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{log.date} · {log.details}</p>
                  </div>
                </div>
              )) : (
                <div className="p-12 text-center text-gray-300 italic">Nenhuma atividade registrada.</div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ── MODAL NOVO PEDIDO ── */}
      {isCreatingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-[100]">
          <div className="w-full max-w-2xl max-h-[92vh] bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <div className="h-1.5 w-12 bg-gray-200 mx-auto mt-3 rounded-full sm:hidden" />
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5d5c5]">
              <h2 className="font-heading text-xl font-bold text-[#524330]">✨ Novo Pedido</h2>
              <button onClick={() => setIsCreatingOrder(false)} className="rounded-full p-2 hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#524330]">👩 Nome da Cliente *</label>
                  <Input value={newOrder.clientName} onChange={(e) => setNewOrder({ ...newOrder, clientName: e.target.value })} className="h-14 rounded-2xl border-[#e5d5c5] text-base" placeholder="Ex: Maria Silva" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#524330]">📞 Telefone</label>
                  <Input value={newOrder.clientPhone} onChange={(e) => setNewOrder({ ...newOrder, clientPhone: e.target.value })} className="h-14 rounded-2xl border-[#e5d5c5] text-base" placeholder="(27) 99999-9999" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#524330]">👶 Nome do Bebê *</label>
                  <Input value={newOrder.babyName} onChange={(e) => setNewOrder({ ...newOrder, babyName: e.target.value })} className="h-14 rounded-2xl border-[#e5d5c5] text-base" placeholder="Ex: João" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#524330]">🎨 Tema</label>
                  <Input value={newOrder.theme} onChange={(e) => setNewOrder({ ...newOrder, theme: e.target.value })} className="h-14 rounded-2xl border-[#e5d5c5] text-base" placeholder="Ex: Ursinhos, Princesa, Dinossauro..." />
                </div>
              </div>

              {/* Produtos */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-[#524330]">🛍️ Produtos *</label>
                <div className="flex gap-2">
                  <select value={orderProductSelect} onChange={(e) => setOrderProductSelect(e.target.value)} className="flex-1 h-12 rounded-xl border border-[#e5d5c5] text-sm text-[#524330] px-3">
                    <option value="">Selecionar produto...</option>
                    {products?.map((p: any) => <option key={p.id} value={p.id}>{p.name} — R$ {p.price}</option>)}
                  </select>
                  <Input type="number" min={1} value={orderProductQty} onChange={(e) => setOrderProductQty(parseInt(e.target.value) || 1)} className="w-16 h-12 rounded-xl border-[#e5d5c5] text-center" />
                  <Button onClick={addProductToOrder} disabled={!orderProductSelect} className="bg-[#a5daeb] text-[#524330] font-bold rounded-xl h-12 px-4">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {newOrder.items.length > 0 && (
                  <div className="bg-[#fdf8f3] rounded-2xl p-4 space-y-2">
                    {newOrder.items.map((item) => (
                      <div key={item.productId} className="flex items-center justify-between text-sm">
                        <span className="text-[#524330] font-medium">{item.quantity}x {item.productName}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-[#524330]">R$ {(item.unitPrice * item.quantity).toFixed(2)}</span>
                          <button onClick={() => removeProductFromOrder(item.productId)} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                    <div className="border-t border-[#e5d5c5] pt-2 flex justify-between font-bold text-[#524330]">
                      <span>Total</span>
                      <span>R$ {orderTotal.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#524330]">💳 Entrada / Sinal</label>
                <Input type="number" step="0.01" value={newOrder.initialPayment} onChange={(e) => setNewOrder({ ...newOrder, initialPayment: e.target.value })} className="h-14 rounded-2xl border-[#e5d5c5] text-base" placeholder="R$ 0,00" />
                {orderTotal > 0 && parseFloat(newOrder.initialPayment) > 0 && (
                  <p className="text-sm text-gray-500">Saldo restante: R$ {(orderTotal - parseFloat(newOrder.initialPayment)).toFixed(2)}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#524330]">📝 Observações</label>
                <textarea value={newOrder.observations} onChange={(e) => setNewOrder({ ...newOrder, observations: e.target.value })} className="w-full min-h-[80px] p-4 rounded-2xl border border-[#e5d5c5] text-base outline-none focus:ring-2 focus:ring-[#a5daeb]" placeholder="Detalhes extras do pedido..." />
              </div>
            </div>

            <div className="p-6 border-t border-[#e5d5c5] space-y-3">
              <Button onClick={handleCreateOrder} className="w-full h-14 rounded-2xl text-lg font-bold text-[#524330] bg-[#a5daeb] hover:bg-[#8ecce0]">✅ Criar Pedido</Button>
              <Button variant="ghost" onClick={() => setIsCreatingOrder(false)} className="w-full h-12 text-gray-400">Cancelar</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL REGISTRAR SAÍDA ── */}
      {isAddingExpense && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-[100]">
          <div className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl overflow-hidden">
            <div className="h-1.5 w-12 bg-gray-200 mx-auto mt-3 rounded-full sm:hidden" />
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5d5c5]">
              <h2 className="font-heading text-xl font-bold text-[#524330]">💸 Nova Saída</h2>
              <button onClick={() => setIsAddingExpense(false)} className="rounded-full p-2 hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#524330]">Descrição *</label>
                <Input value={newExpense.description} onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })} className="h-14 rounded-2xl border-[#e5d5c5] text-base" placeholder="Ex: Tecido algodão branco" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#524330]">Categoria</label>
                  <select value={newExpense.category} onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })} className="w-full h-14 rounded-2xl border border-[#e5d5c5] text-base text-[#524330] px-4">
                    {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#524330]">Valor *</label>
                  <Input type="number" step="0.01" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} className="h-14 rounded-2xl border-[#e5d5c5] text-base font-bold text-red-500" placeholder="R$ 0,00" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#524330]">Data</label>
                <Input type="date" value={newExpense.date} onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })} className="h-14 rounded-2xl border-[#e5d5c5] text-base" />
              </div>
            </div>
            <div className="p-6 border-t border-[#e5d5c5] space-y-3">
              <Button onClick={handleAddExpense} className="w-full h-14 rounded-2xl text-lg font-bold text-[#524330] bg-[#a5daeb] hover:bg-[#8ecce0]">✅ Registrar Saída</Button>
              <Button variant="ghost" onClick={() => setIsAddingExpense(false)} className="w-full h-12 text-gray-400">Cancelar</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL EDITAR PRODUTO ── */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-[100]">
          <div className="w-full max-w-2xl max-h-[92vh] bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <div className="h-1.5 w-12 bg-gray-200 mx-auto mt-3 rounded-full sm:hidden" />
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5d5c5]">
              <h2 className="font-heading text-xl font-bold text-[#524330]">{isAddingNew ? "Novo Produto" : "Editar Produto"}</h2>
              <button onClick={() => setEditingProduct(null)} className="rounded-full p-2 hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-6 space-y-5">
              <div className="flex flex-col items-center gap-4">
                <img src={editingProduct.images.main} className="w-32 h-32 rounded-2xl object-cover shadow-md" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&h=200&fit=crop"; }} />
                <label className="w-full max-w-sm cursor-pointer">
                  <div className="border-2 border-dashed border-[#a5daeb] rounded-2xl p-4 text-center hover:bg-[#f5ebe0] transition-colors">
                    <Upload className="w-5 h-5 mx-auto mb-1 text-[#a5daeb]" />
                    <p className="text-xs font-bold text-[#524330]">Enviar foto</p>
                    <input type="file" accept="image/*" onChange={handleProductImageUpload} disabled={isUploadingImage} className="hidden" />
                  </div>
                </label>
                <div className="w-full max-w-sm">
                  <label className="text-xs text-gray-400 font-bold">Ou cole o link</label>
                  <Input value={editingProduct.images.main} onChange={(e) => setEditingProduct({ ...editingProduct, images: { ...editingProduct.images, main: e.target.value } })} className="h-10 rounded-xl border-[#e5d5c5] text-sm mt-1" placeholder="URL da imagem" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#524330]">Nome da Peça</label>
                <Input value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} className="h-14 rounded-2xl border-[#e5d5c5] text-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#524330]">Preço (R$)</label>
                  <Input type="number" step="0.01" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })} className="h-14 rounded-2xl border-[#e5d5c5] text-lg font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#524330]">Categoria</label>
                  <Input value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} className="h-14 rounded-2xl border-[#e5d5c5] text-lg" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#524330]">Descrição</label>
                <textarea className="w-full min-h-[80px] p-4 rounded-2xl border border-[#e5d5c5] text-base outline-none focus:ring-2 focus:ring-[#a5daeb]" value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-[#524330]">Especificações</label>
                  <Button onClick={() => setEditingProduct({ ...editingProduct, specs: [...editingProduct.specs, ""] })} variant="outline" size="sm" className="rounded-full h-8 px-3 text-xs border-[#a5daeb] text-[#524330]"><Plus className="w-3 h-3 mr-1" /> Adicionar</Button>
                </div>
                {editingProduct.specs.map((spec: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <Input value={spec} onChange={(e) => handleSpecChange(index, e.target.value)} className="h-10 rounded-xl border-[#e5d5c5] text-sm" placeholder="Ex: 100% Algodão" />
                    <Button onClick={() => setEditingProduct({ ...editingProduct, specs: editingProduct.specs.filter((_: any, i: number) => i !== index) })} variant="ghost" size="sm" className="text-red-400 p-2"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-[#e5d5c5] space-y-3">
              <Button onClick={handleSaveProduct} disabled={isSaving} className="w-full h-14 rounded-2xl text-lg font-bold text-[#524330] bg-[#a5daeb] hover:bg-[#8ecce0]">
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                {isAddingNew ? "Criar Produto" : "Salvar Alterações"}
              </Button>
              <Button variant="ghost" onClick={() => setEditingProduct(null)} className="w-full h-12 text-gray-400">Cancelar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Alias para ícone Edit
function Edit(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={props.className?.includes("w-3") ? 12 : 16} height={props.className?.includes("w-3") ? 12 : 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
}
