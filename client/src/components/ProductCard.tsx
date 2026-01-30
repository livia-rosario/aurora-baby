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
      className="group flex h-full w-full flex-col rounded-2xl border bg-white p-6 text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{ borderColor: "rgba(82, 67, 48, 0.1)" }}
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-4 text-center">
        <h3
          className="font-heading text-2xl font-semibold leading-snug transition-colors group-hover:opacity-80"
          style={{ color: "var(--accent-coral)" }}
        >
          {name}
        </h3>
        <p className="text-3xl font-bold" style={{ color: "var(--soft-brown)" }}>
          R$ {price}
        </p>
      </div>
      <div className="mt-auto flex items-center justify-between pt-4">
        <span className="text-sm font-semibold" style={{ color: "rgba(82, 67, 48, 0.6)" }}>
          Ver detalhes
        </span>
        <ShoppingCart
          className="h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100"
          style={{ color: "var(--accent-blue)" }}
        />
      </div>
    </button>
  );
}
