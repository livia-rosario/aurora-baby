import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  onOpen: (id: string) => void;
}

export function ProductCard({ id, name, price, onOpen }: ProductCardProps) {
  return (
    <button
      onClick={() => onOpen(id)}
      className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border text-left w-full"
      style={{ borderColor: "rgba(82, 67, 48, 0.1)" }}
    >
      <h3 className="font-heading text-2xl font-bold mb-3 group-hover:opacity-80 transition-colors" style={{ color: "var(--accent-coral)" }}>
        {name}
      </h3>
      <p className="text-3xl font-bold mb-6" style={{ color: "var(--soft-brown)" }}>R$ {price}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium" style={{ color: "rgba(82, 67, 48, 0.6)" }}>Ver detalhes</span>
        <ShoppingCart className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--accent-blue)" }} />
      </div>
    </button>
  );
}
