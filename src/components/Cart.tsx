import { useState } from "react";
import { ShoppingCart, X, Plus, Minus, Trash2, MessageSquare } from "lucide-react";
import { useCart } from "./CartContext";
import { Button } from "@/components/ui/button";

export function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeItem, updateQuantity, clearCart, total, count } = useCart();

  const handleFinalize = () => {
    if (items.length === 0) return;

    const lines = items.map(
      (item) =>
        `• ${item.name} x${item.quantity} — R$ ${(item.price * item.quantity).toFixed(2)}`
    );

    const message =
      `Olá! Gostaria de fazer um pedido:\n\n` +
      lines.join("\n") +
      `\n\n*Total: R$ ${total.toFixed(2)}*\n\nPoderia me passar mais informações?`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/5527992941519?text=${encoded}`, "_blank");
  };

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 rounded-full shadow-xl transition-all hover:scale-105"
        style={{ backgroundColor: "var(--accent-blue)" }}
      >
        <ShoppingCart className="w-7 h-7 text-white" />
        {count > 0 && (
          <span
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
            style={{ backgroundColor: "var(--accent-coral)" }}
          >
            {count}
          </span>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer lateral */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "rgba(82,67,48,0.1)" }}>
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" style={{ color: "var(--accent-blue)" }} />
            <h2 className="font-heading text-xl font-bold" style={{ color: "var(--soft-brown)" }}>
              Meu Carrinho
            </h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" style={{ color: "var(--soft-brown)" }} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3 opacity-50">
              <ShoppingCart className="w-12 h-12" style={{ color: "var(--soft-brown)" }} />
              <p style={{ color: "var(--soft-brown)" }}>Seu carrinho está vazio</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-4 rounded-2xl border bg-white"
                style={{ borderColor: "rgba(82,67,48,0.1)" }}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: "var(--soft-brown)" }}>
                    {item.name}
                  </p>
                  <p className="text-sm font-bold mt-1" style={{ color: "var(--accent-coral)" }}>
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-full flex items-center justify-center border transition hover:bg-gray-50"
                    style={{ borderColor: "rgba(82,67,48,0.2)" }}
                  >
                    <Minus className="w-3 h-3" style={{ color: "var(--soft-brown)" }} />
                  </button>
                  <span className="w-5 text-center font-bold text-sm" style={{ color: "var(--soft-brown)" }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-full flex items-center justify-center border transition hover:bg-gray-50"
                    style={{ borderColor: "rgba(82,67,48,0.2)" }}
                  >
                    <Plus className="w-3 h-3" style={{ color: "var(--soft-brown)" }} />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="w-7 h-7 rounded-full flex items-center justify-center ml-1 hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-3 h-3 text-red-400" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t space-y-4" style={{ borderColor: "rgba(82,67,48,0.1)" }}>
            <div className="flex justify-between items-center">
              <span className="font-semibold" style={{ color: "var(--soft-brown)" }}>Total</span>
              <span className="text-2xl font-bold" style={{ color: "var(--soft-brown)" }}>
                R$ {total.toFixed(2)}
              </span>
            </div>
            <Button
              onClick={handleFinalize}
              className="w-full text-white font-semibold py-6 rounded-xl flex items-center justify-center gap-2 text-lg"
              style={{ backgroundColor: "var(--accent-blue)" }}
            >
              <MessageSquare className="w-5 h-5" />
              Finalizar pelo WhatsApp
            </Button>
            <button
              onClick={clearCart}
              className="w-full text-sm text-center opacity-50 hover:opacity-80 transition"
              style={{ color: "var(--soft-brown)" }}
            >
              Limpar carrinho
            </button>
          </div>
        )}
      </div>
    </>
  );
}
