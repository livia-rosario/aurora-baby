import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Trash2, DollarSign, TrendingUp, Clock, BarChart3, Edit2 } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const STATUS_COLORS = {
  "Pedido Feito": "bg-blue-100 text-blue-800",
  "Personalização": "bg-purple-100 text-purple-800",
  "Acabamento": "bg-yellow-100 text-yellow-800",
  "Pronto": "bg-green-100 text-green-800",
  "Entregue": "bg-gray-100 text-gray-800",
};

const STATUS_ORDER = ["Pedido Feito", "Personalização", "Acabamento", "Pronto", "Entregue"];
const TEMAS = ["Unicórnio", "Dinossauro", "Princesa", "Herói", "Astronauta", "Floresta", "Oceano", "Arco-íris", "Customizado"];

export default function Orders() {
  const orders = useQuery(api.aurora.getOrders);
  const metrics = useQuery(api.aurora.getOrderMetrics);
  const createOrder = useMutation(api.aurora.createOrder);
  const updateOrderStatus = useMutation(api.aurora.updateOrderStatus);
  const updateOrderPayment = useMutation(api.aurora.updateOrderPayment);
  const deleteOrder = useMutation(api.aurora.deleteOrder);

  const [viewMode, setViewMode] = useState<"kanban" | "dashboard">("kanban");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [newPayment, setNewPayment] = useState<{ [key: string]: number }>({});

  const [newOrder, setNewOrder] = useState({
    clientName: "",
    childName: "",
    theme: "Customizado",
    totalValue: 0,
    amountPaid: 0,
    clientPhone: "",
  });

  const handleCreateOrder = async () => {
    if (!newOrder.clientName || !newOrder.childName || newOrder.totalValue <= 0) {
      alert("Preencha o nome da mãe, da criança e o valor!");
      return;
    }

    try {
      await createOrder({
        clientName: newOrder.clientName,
        clientPhone: newOrder.clientPhone,
        items: [
          {
            productId: "custom",
            productName: `Enxoval - ${newOrder.childName} (${newOrder.theme})`,
            quantity: 1,
            unitPrice: newOrder.totalValue,
          },
        ],
        observations: `Criança: ${newOrder.childName} | Tema: ${newOrder.theme}`,
        deliveryDate: "",
      });

      setNewOrder({
        clientName: "",
        childName: "",
        theme: "Customizado",
        totalValue: 0,
        amountPaid: 0,
        clientPhone: "",
      });
      setIsCreatingOrder(false);
      alert("Pedido criado com sucesso!");
    } catch (err: any) {
      alert("Erro ao criar pedido: " + err.message);
    }
  };

  const handleStatusChange = async (orderId: any, newStatus: string, assignedTo: string) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus, assignedTo });
    } catch (err: any) {
      alert("Erro ao atualizar status: " + err.message);
    }
  };

  const handleAddPayment = async (orderId: any, amount: number) => {
    if (amount <= 0) {
      alert("Digite um valor válido!");
      return;
    }

    const order = orders?.find((o) => o._id === orderId);
    if (!order) return;

    const newTotal = order.amountPaid + amount;
    if (newTotal > order.totalValue) {
      alert(`Valor não pode exceder o total de R$ ${order.totalValue.toFixed(2)}`);
      return;
    }

    try {
      await updateOrderPayment({ orderId, amountPaid: newTotal });
      setNewPayment({ ...newPayment, [orderId]: 0 });
      alert("Pagamento registrado!");
    } catch (err: any) {
      alert("Erro ao registrar pagamento: " + err.message);
    }
  };

  const handleDeleteOrder = async (orderId: any) => {
    if (confirm("Tem certeza que deseja excluir este pedido?")) {
      try {
        await deleteOrder({ orderId });
        alert("Pedido deletado!");
      } catch (err: any) {
        alert("Erro ao deletar: " + err.message);
      }
    }
  };

  if (viewMode === "dashboard") {
    return (
      <div className="min-h-screen bg-[#fdf8f3] p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-heading font-bold text-[#524330]">💰 Dashboard Financeiro</h1>
            <Button onClick={() => setViewMode("kanban")} className="bg-[#a5daeb] hover:bg-[#8ecce0] text-[#524330] rounded-full h-14 px-6 font-bold text-lg">
              ← Voltar
            </Button>
          </div>

          {metrics ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-none shadow-lg rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="text-center">
                    <p className="text-gray-500 text-sm font-semibold">Total de Pedidos</p>
                    <p className="text-5xl font-bold text-[#524330] mt-3">{metrics.totalOrders}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="text-center">
                    <p className="text-gray-500 text-sm font-semibold">Faturamento</p>
                    <p className="text-5xl font-bold text-green-600 mt-3">R$ {metrics.totalRevenue.toFixed(2)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="text-center">
                    <p className="text-gray-500 text-sm font-semibold">Recebido</p>
                    <p className="text-5xl font-bold text-blue-600 mt-3">R$ {metrics.totalReceived.toFixed(2)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="text-center">
                    <p className="text-gray-500 text-sm font-semibold">A Receber</p>
                    <p className="text-5xl font-bold text-orange-600 mt-3">R$ {metrics.totalPending.toFixed(2)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-20 text-xl">Carregando...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f3] p-4 pb-32">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
          <h1 className="text-4xl font-heading font-bold text-[#524330]">📋 Gestão de Pedidos</h1>
          <div className="flex gap-3 flex-wrap">
            <Button onClick={() => setViewMode("dashboard")} className="bg-[#f5ebe0] hover:bg-[#eddecb] text-[#524330] rounded-full h-14 px-6 font-bold text-lg">
              <BarChart3 className="w-5 h-5 mr-2" /> Dashboard
            </Button>
            <Button onClick={() => setIsCreatingOrder(true)} className="bg-[#a5daeb] hover:bg-[#8ecce0] text-[#524330] rounded-full h-14 px-6 font-bold text-lg">
              <Plus className="w-5 h-5 mr-2" /> Novo Pedido
            </Button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pb-6">
          {STATUS_ORDER.map((status) => (
            <div key={status} className="min-w-full md:min-w-0">
              <div className={`p-4 rounded-2xl mb-4 border-2 font-bold text-center ${STATUS_COLORS[status as keyof typeof STATUS_COLORS]}`}>
                <p className="text-lg">{status}</p>
                <p className="text-sm opacity-75 mt-1">
                  {orders?.filter((o) => o.status === status).length || 0} pedidos
                </p>
              </div>

              <div className="space-y-3">
                {orders
                  ?.filter((o) => o.status === status)
                  .map((order) => {
                    const childName = order.observations?.split("|")[0]?.replace("Criança:", "").trim() || "Bebê";
                    const theme = order.observations?.split("|")[1]?.replace("Tema:", "").trim() || "";
                    const pending = order.totalValue - order.amountPaid;

                    return (
                      <Card
                        key={order._id}
                        className="border-none shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer active:scale-95"
                        onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-grow">
                              <h4 className="font-bold text-[#524330] text-base">👶 {childName}</h4>
                              <p className="text-xs text-gray-500 mt-1">{order.clientName}</p>
                            </div>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteOrder(order._id);
                              }}
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-600 p-1 h-auto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          {theme && (
                            <div className="bg-purple-100 text-purple-800 rounded-lg px-3 py-1 text-xs font-semibold mb-3 inline-block">
                              🎨 {theme}
                            </div>
                          )}

                          <div className="bg-[#f5ebe0] rounded-xl p-3 mb-3 space-y-1">
                            <p className="text-sm font-bold text-[#524330]">
                              Total: R$ {order.totalValue.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-600">
                              Pago: R$ {order.amountPaid.toFixed(2)}
                            </p>
                            <p className={`text-xs font-bold ${pending > 0 ? "text-orange-600" : "text-green-600"}`}>
                              {pending > 0 ? `Falta: R$ ${pending.toFixed(2)}` : "✅ Pago!"}
                            </p>
                          </div>

                          {order.assignedTo && (
                            <p className="text-xs font-bold text-[#a5daeb] mb-3">
                              👤 Com {order.assignedTo}
                            </p>
                          )}

                          {/* Expandable Section */}
                          {expandedOrder === order._id && (
                            <div className="border-t pt-3 mt-3 space-y-3">
                              <div className="flex gap-2">
                                {STATUS_ORDER.indexOf(status) < STATUS_ORDER.length - 1 && (
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStatusChange(
                                        order._id,
                                        STATUS_ORDER[STATUS_ORDER.indexOf(status) + 1],
                                        order.assignedTo || ""
                                      );
                                    }}
                                    className="flex-1 bg-[#a5daeb] hover:bg-[#8ecce0] text-[#524330] rounded-lg h-10 text-xs font-bold"
                                  >
                                    Próximo →
                                  </Button>
                                )}
                              </div>

                              <select
                                value={order.assignedTo || ""}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(order._id, status, e.target.value);
                                }}
                                className="w-full text-xs p-2 rounded-lg border border-[#e5d5c5] bg-white text-[#524330] font-bold"
                              >
                                <option value="">Atribuir a...</option>
                                <option value="Miriam">Miriam</option>
                                <option value="Denize">Denize</option>
                              </select>

                              {/* Pagamento Parcelado */}
                              {pending > 0 && (
                                <div className="bg-yellow-50 rounded-lg p-3 space-y-2">
                                  <p className="text-xs font-bold text-yellow-800">💳 Registrar Pagamento</p>
                                  <div className="flex gap-2">
                                    <Input
                                      type="number"
                                      step="0.01"
                                      value={newPayment[order._id] || ""}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        setNewPayment({ ...newPayment, [order._id]: parseFloat(e.target.value) || 0 });
                                      }}
                                      className="flex-grow h-10 rounded-lg border-yellow-300 text-xs"
                                      placeholder="Valor"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    <Button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddPayment(order._id, newPayment[order._id] || 0);
                                      }}
                                      className="bg-green-500 hover:bg-green-600 text-white rounded-lg h-10 px-3 text-xs font-bold"
                                    >
                                      ✓
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Novo Pedido - SUPER SIMPLES */}
      {isCreatingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-[100] overflow-hidden">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-none rounded-t-[32px] sm:rounded-3xl shadow-2xl flex flex-col">
            <div className="h-1.5 w-12 bg-gray-200 mx-auto mt-3 rounded-full sm:hidden" />
            <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
              <CardTitle className="text-2xl font-heading text-[#524330]">✨ Novo Pedido</CardTitle>
              <Button variant="ghost" onClick={() => setIsCreatingOrder(false)} className="rounded-full">
                <X className="w-6 h-6" />
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-6 flex-grow">
              {/* Nome da Mãe */}
              <div className="space-y-3">
                <label className="text-lg font-bold text-[#524330]">👩 Nome de Quem Pediu</label>
                <Input
                  value={newOrder.clientName}
                  onChange={(e) => setNewOrder({ ...newOrder, clientName: e.target.value })}
                  className="h-16 rounded-2xl border-[#e5d5c5] text-lg font-semibold"
                  placeholder="Ex: Maria Silva"
                />
              </div>

              {/* Nome da Criança */}
              <div className="space-y-3">
                <label className="text-lg font-bold text-[#524330]">👶 Nome da Criança</label>
                <Input
                  value={newOrder.childName}
                  onChange={(e) => setNewOrder({ ...newOrder, childName: e.target.value })}
                  className="h-16 rounded-2xl border-[#e5d5c5] text-lg font-semibold"
                  placeholder="Ex: João"
                />
              </div>

              {/* Tema */}
              <div className="space-y-3">
                <label className="text-lg font-bold text-[#524330]">🎨 Tema do Enxoval</label>
                <select
                  value={newOrder.theme}
                  onChange={(e) => setNewOrder({ ...newOrder, theme: e.target.value })}
                  className="w-full h-16 rounded-2xl border border-[#e5d5c5] text-lg font-semibold text-[#524330] px-4"
                >
                  {TEMAS.map((tema) => (
                    <option key={tema} value={tema}>
                      {tema}
                    </option>
                  ))}
                </select>
              </div>

              {/* Valor Total */}
              <div className="space-y-3">
                <label className="text-lg font-bold text-[#524330]">💰 Valor Total</label>
                <Input
                  type="number"
                  step="0.01"
                  value={newOrder.totalValue || ""}
                  onChange={(e) => setNewOrder({ ...newOrder, totalValue: parseFloat(e.target.value) || 0 })}
                  className="h-16 rounded-2xl border-[#e5d5c5] text-lg font-bold text-[#a5daeb]"
                  placeholder="Ex: 500.00"
                />
              </div>

              {/* Entrada (Sinal) */}
              <div className="space-y-3">
                <label className="text-lg font-bold text-[#524330]">💳 Entrada (Sinal)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={newOrder.amountPaid || ""}
                  onChange={(e) => setNewOrder({ ...newOrder, amountPaid: parseFloat(e.target.value) || 0 })}
                  className="h-16 rounded-2xl border-[#e5d5c5] text-lg font-bold text-green-600"
                  placeholder="Ex: 100.00"
                />
                {newOrder.totalValue > 0 && newOrder.amountPaid > 0 && (
                  <p className="text-sm text-gray-600 font-semibold">
                    Saldo a parcelar: R$ {(newOrder.totalValue - newOrder.amountPaid).toFixed(2)}
                  </p>
                )}
              </div>

              {/* Telefone */}
              <div className="space-y-3">
                <label className="text-lg font-bold text-[#524330]">📞 Telefone (opcional)</label>
                <Input
                  value={newOrder.clientPhone}
                  onChange={(e) => setNewOrder({ ...newOrder, clientPhone: e.target.value })}
                  className="h-16 rounded-2xl border-[#e5d5c5] text-lg"
                  placeholder="(27) 99999-9999"
                />
              </div>
            </CardContent>

            <div className="p-6 bg-gray-50 border-t flex flex-col gap-3">
              <Button
                onClick={handleCreateOrder}
                className="w-full bg-[#a5daeb] hover:bg-[#8ecce0] text-[#524330] font-bold h-16 rounded-2xl text-lg shadow-lg"
              >
                ✅ Criar Pedido
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsCreatingOrder(false)}
                className="w-full h-14 text-gray-400 font-medium text-base"
              >
                Cancelar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
