import React from 'react';
import { MapPin, Phone, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t py-12 px-4 sm:px-6 lg:px-8 mt-20" style={{ borderColor: 'rgba(82, 67, 48, 0.1)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo e Frase */}
          <div className="flex flex-col items-start">
            <img src="/images/logo.png" alt="Aurora Baby" className="h-12 mb-4" />
            <p className="text-sm italic" style={{ color: 'rgba(82, 67, 48, 0.8)' }}>
              Enxovais feitos à mão, do nosso coração para o seu bebê.
            </p>
          </div>

          {/* Navegação */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-heading font-bold text-lg" style={{ color: 'var(--soft-brown)' }}>Navegação</h3>
            <ul className="space-y-2">
              <li><a href="#catalogo" className="text-sm hover:underline" style={{ color: 'rgba(82, 67, 48, 0.7)' }}>Catálogo</a></li>
              <li><a href="#comprar" className="text-sm hover:underline" style={{ color: 'rgba(82, 67, 48, 0.7)' }}>Como Comprar</a></li>
              <li><a href="https://wa.me/5527992941519" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline" style={{ color: 'rgba(82, 67, 48, 0.7)' }}>Contato</a></li>
            </ul>
          </div>

          {/* Fale Conosco */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-heading font-bold text-lg" style={{ color: 'var(--soft-brown)' }}>Fale Conosco</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-sm" style={{ color: 'rgba(82, 67, 48, 0.7)' }}>
                <div className="p-1.5 rounded-full" style={{ backgroundColor: 'rgba(165, 218, 235, 0.2)' }}>
                  <MapPin className="w-4 h-4" style={{ color: 'var(--accent-blue)' }} />
                </div>
                <span>Vila Velha — ES</span>
              </li>
              <li className="flex items-center space-x-3 text-sm" style={{ color: 'rgba(82, 67, 48, 0.7)' }}>
                <div className="p-1.5 rounded-full" style={{ backgroundColor: 'rgba(165, 218, 235, 0.2)' }}>
                  <Phone className="w-4 h-4" style={{ color: 'var(--accent-blue)' }} />
                </div>
                <span>(27) 99294-1519</span>
              </li>
              <li className="flex items-center space-x-3 text-sm" style={{ color: 'rgba(82, 67, 48, 0.7)' }}>
                <div className="p-1.5 rounded-full" style={{ backgroundColor: 'rgba(165, 218, 235, 0.2)' }}>
                  <Instagram className="w-4 h-4" style={{ color: 'var(--accent-blue)' }} />
                </div>
                <a href="https://www.instagram.com/aurorababyloja" target="_blank" rel="noopener noreferrer" className="hover:underline">@aurorababyloja</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha Divisória e Copyright */}
        <div className="pt-8 border-t text-center" style={{ borderColor: 'rgba(82, 67, 48, 0.05)' }}>
          <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(82, 67, 48, 0.5)' }}>
            © 2025 AURORA BABY. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
