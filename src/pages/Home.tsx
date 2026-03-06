import { useState } from "react";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { Button } from "@/components/ui/button";
import InstagramFeed from "@/components/InstagramFeed";
import Footer from "@/components/Footer";
import { Cart } from "@/components/Cart";
import { CartProvider } from "@/components/CartContext";
import { Instagram, Phone, Wallet, Clock, Truck, CreditCard } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface Product {
  _id: string;
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  specs: string[];
  images: {
    main: string;
    gallery: string[];
  };
  whatsappMessage: string;
}

function ProductCardSkeleton() {
  return (
    <div className="flex h-full w-full flex-col rounded-2xl border bg-white p-6 shadow-md animate-pulse"
      style={{ borderColor: "rgba(82, 67, 48, 0.1)" }}>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-4">
        <div className="h-7 w-3/4 rounded-lg" style={{ backgroundColor: "rgba(82, 67, 48, 0.08)" }} />
        <div className="h-9 w-1/2 rounded-lg" style={{ backgroundColor: "rgba(82, 67, 48, 0.08)" }} />
      </div>
      <div className="mt-auto flex items-center justify-between pt-4">
        <div className="h-4 w-20 rounded-lg" style={{ backgroundColor: "rgba(82, 67, 48, 0.08)" }} />
        <div className="h-5 w-5 rounded-full" style={{ backgroundColor: "rgba(82, 67, 48, 0.08)" }} />
      </div>
    </div>
  );
}

function HomeContent() {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const products = useQuery(api.aurora.getProducts) as Product[] | undefined;
  const selectedProduct = products?.find((p) => p.id === selectedProductId);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--base-bg)" }}>
      <Header />

      <main className="flex-grow max-w-7xl mx-auto pt-10 pb-20 px-4 sm:px-6 lg:px-8">
        <section id="hero" className="pt-6 pb-10 text-center">
          <p className="text-xl sm:text-2xl font-medium font-heading" style={{ color: "var(--soft-brown)" }}>
            Peças personalizadas com amor para o seu bebê.
          </p>
        </section>

        <section id="catalogo" className="pt-16 md:pt-20 pb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-center mb-12" style={{ color: "var(--soft-brown)" }}>
            Catálogo & Valores
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {!products
              ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    onOpen={setSelectedProductId}
                  />
                ))}
          </div>

          <div className="text-center">
            <a
              href="https://instagram.com/aurorababyloja"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 px-8 py-4 rounded-full bg-white text-lg font-semibold hover:shadow-lg transition duration-300 shadow-md border"
              style={{ color: "var(--soft-brown)", borderColor: "rgba(82, 67, 48, 0.1)" }}
            >
              <Instagram className="w-5 h-5" />
              <span>Ver Modelos no Instagram</span>
            </a>
            <InstagramFeed />
          </div>
        </section>

        <section id="comprar" className="pt-16 md:pt-20 pb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-center mb-12" style={{ color: "var(--soft-brown)" }}>
            Como Comprar
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 hover:shadow-lg transition duration-300" style={{ borderColor: "var(--accent-blue)" }}>
              <h3 className="font-heading text-xl font-bold flex items-center mb-3">
                <Phone className="w-6 h-6 mr-2" style={{ color: "var(--accent-blue)" }} />
                Atendimento
              </h3>
              <p className="text-base" style={{ color: "rgba(82, 67, 48, 0.8)" }}>
                Nosso atendimento é feito por WhatsApp ou direct, de segunda a sexta.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 hover:shadow-lg transition duration-300" style={{ borderColor: "var(--accent-coral)" }}>
              <h3 className="font-heading text-xl font-bold flex items-center mb-3">
                <Wallet className="w-6 h-6 mr-2" style={{ color: "var(--accent-coral)" }} />
                Entrada
              </h3>
              <p className="text-base" style={{ color: "rgba(82, 67, 48, 0.8)" }}>
                Iniciamos a confecção 1 dia após o recebimento de 50% do valor da encomenda.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 hover:shadow-lg transition duration-300" style={{ borderColor: "var(--accent-yellow)" }}>
              <h3 className="font-heading text-xl font-bold flex items-center mb-3">
                <Clock className="w-6 h-6 mr-2" style={{ color: "var(--accent-yellow)" }} />
                Prazo
              </h3>
              <p className="text-base" style={{ color: "rgba(82, 67, 48, 0.8)" }}>
                Como nossos produtos são personalizados, o prazo é de 1 mês em média. Trabalhamos com agenda.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 hover:shadow-lg transition duration-300" style={{ borderColor: "var(--accent-blue)" }}>
              <h3 className="font-heading text-xl font-bold flex items-center mb-3">
                <Truck className="w-6 h-6 mr-2" style={{ color: "var(--accent-blue)" }} />
                Entrega
              </h3>
              <p className="text-base" style={{ color: "rgba(82, 67, 48, 0.8)" }}>
                Ficamos em Vila Velha - ES. Entrega ou retirada a combinar de acordo com a localidade.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md border" style={{ borderColor: "rgba(82, 67, 48, 0.1)" }}>
            <h3 className="font-heading text-2xl font-bold mb-6 flex items-center" style={{ color: "var(--accent-coral)" }}>
              <CreditCard className="w-6 h-6 mr-2" />
              Formas de Pagamento
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Pix", "PicPay", "Transferência Bancária", "Dinheiro"].map((method) => (
                <div
                  key={method}
                  className="p-4 rounded-lg text-center font-semibold"
                  style={{ backgroundColor: "rgba(253, 214, 146, 0.2)", color: "var(--soft-brown)" }}
                >
                  {method}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pt-16 md:pt-20 pb-16 text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-8" style={{ color: "var(--soft-brown)" }}>
            Pronta para Criar o Enxoval Perfeito?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: "rgba(82, 67, 48, 0.8)" }}>
            Vamos começar o processo de personalização hoje mesmo. Entre em contato conosco pelo WhatsApp!
          </p>
          <a href="https://wa.me/5527997352336" target="_blank" rel="noopener noreferrer">
            <Button className="text-white font-semibold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all" style={{ backgroundColor: "var(--accent-blue)" }}>
              Iniciar Pedido via WhatsApp
            </Button>
          </a>
        </section>
      </main>

      <Footer />
      <Cart />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct as any}
          isOpen={!!selectedProductId}
          onClose={() => setSelectedProductId(null)}
        />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <CartProvider>
      <HomeContent />
    </CartProvider>
  );
}
