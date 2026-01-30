import { useState } from "react";
import { Menu, X, MessageSquare } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-md" style={{ backgroundColor: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(8px)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center">
            <img 
              src="/images/logo.png" 
              alt="Aurora Baby" 
              className="h-12 sm:h-16 w-auto"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex space-x-8 items-center text-lg font-medium">
            <button
              onClick={() => scrollToSection("catalogo")}
              className="hover:opacity-70 transition duration-200"
              style={{ color: "var(--soft-brown)" }}
            >
              Catálogo
            </button>
            <button
              onClick={() => scrollToSection("comprar")}
              className="hover:opacity-70 transition duration-200"
              style={{ color: "var(--soft-brown)" }}
            >
              Como Comprar
            </button>
            <a
              href="https://wa.me/5527992941519"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-5 py-2 rounded-full text-white font-semibold transition duration-300 shadow-md hover:shadow-lg"
              style={{ backgroundColor: "var(--accent-blue)" }}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Contato</span>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition duration-200"
          >
            {mobileMenuOpen ? (
              <X className="w-7 h-7" style={{ color: "var(--soft-brown)" }} />
            ) : (
              <Menu className="w-7 h-7" style={{ color: "var(--soft-brown)" }} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t shadow-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.95)", borderColor: "rgba(82, 67, 48, 0.1)" }}>
          <div className="px-4 pt-2 pb-3 space-y-2 font-medium">
            <button
              onClick={() => scrollToSection("catalogo")}
              className="block w-full text-left py-2 px-3 rounded-md hover:opacity-70 transition duration-200"
              style={{ color: "var(--soft-brown)" }}
            >
              Catálogo
            </button>
            <button
              onClick={() => scrollToSection("comprar")}
              className="block w-full text-left py-2 px-3 rounded-md hover:opacity-70 transition duration-200"
              style={{ color: "var(--soft-brown)" }}
            >
              Como Comprar
            </button>
            <a
              href="https://wa.me/5527992941519"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-2 px-3 rounded-md transition duration-200"
              style={{ color: "var(--soft-brown)" }}
            >
              Contato (WhatsApp)
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
