import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Product {
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

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) return null;

  // Combina main + gallery para o carrossel
  const allImages = [product.images.main, ...product.images.gallery];
  const currentImage = allImages[currentImageIndex];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handleWhatsApp = () => {
    const phoneNumber = "5527992941519";
    const message = encodeURIComponent(product.whatsappMessage);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading font-bold" style={{ color: "var(--accent-coral)" }}>
            {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          {/* Carrossel de Imagens */}
          <div className="flex flex-col gap-4">
            {/* Imagem Principal */}
            <div
              className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border p-6"
              style={{
                backgroundColor: "rgba(253, 214, 146, 0.1)",
                borderColor: "rgba(82, 67, 48, 0.12)",
              }}
            >
              <img
                src={currentImage}
                alt={`${product.name} ${currentImageIndex + 1}`}
                className="h-full w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=500&fit=crop";
                }}
              />

              {/* Botões de Navegação */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-6 h-6" style={{ color: "var(--soft-brown)" }} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-6 h-6" style={{ color: "var(--soft-brown)" }} />
                  </button>
                </>
              )}

              {/* Indicador de Página */}
              {allImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              )}
            </div>

            {/* Miniaturas */}
            {allImages.length > 1 && (
              <div className="flex flex-wrap justify-center gap-3">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`h-16 w-16 overflow-hidden rounded-xl border-2 transition-all ${
                      idx === currentImageIndex ? "border-accent-coral" : "border-gray-200"
                    }`}
                    style={{
                      borderColor: idx === currentImageIndex ? "var(--accent-coral)" : "rgba(82, 67, 48, 0.2)",
                      backgroundColor: "rgba(253, 214, 146, 0.1)",
                    }}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=100&h=100&fit=crop";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detalhes do Produto */}
          <div className="flex flex-col justify-between">
            {/* Título e Categoria */}
            <div>
              <p className="text-sm font-medium mb-2" style={{ color: "rgba(82, 67, 48, 0.6)" }}>
                {product.category}
              </p>

              {/* Preço */}
              <div className="mb-6">
                <p className="text-4xl font-bold" style={{ color: "var(--soft-brown)" }}>
                  R$ {product.price}
                </p>
              </div>

              {/* Descrição */}
              <div className="mb-6">
                <p className="text-base leading-relaxed font-body" style={{ color: "var(--soft-brown)" }}>
                  {product.description}
                </p>
              </div>

              {/* Especificações Técnicas */}
              {product.specs.length > 0 && (
                <div className="mb-6">
                  <ul className="space-y-2">
                    {product.specs.map((spec, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
                          style={{ backgroundColor: "var(--accent-coral)" }}
                        />
                        <span className="text-sm" style={{ color: "var(--soft-brown)" }}>
                          {spec}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Nota Especial */}
              <div
                className="p-4 rounded-lg mb-6 text-sm"
                style={{ backgroundColor: "rgba(247, 182, 179, 0.1)", color: "var(--soft-brown)" }}
              >
                ✨ <strong>Entrega especial:</strong> Embalado em saquinho de filó com fita — perfeito para presentear!
              </div>
            </div>

            {/* Botão WhatsApp */}
            <Button
              onClick={handleWhatsApp}
              className="w-full text-white font-semibold py-6 rounded-xl flex items-center justify-center gap-2 text-lg transition-all hover:shadow-lg"
              style={{ backgroundColor: "var(--accent-blue)" }}
            >
              <MessageSquare className="w-5 h-5" />
              Pedir no WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
