# Aurora Baby Boutique Digital — Documentação Técnica

## 📋 Visão Geral

Este é um site de boutique digital para a Aurora Baby, especializada em enxoval de bebê personalizado. O site foi construído com React + Tailwind CSS e é hospedado gratuitamente no Netlify.

**Características principais:**
- ✅ Modal interativo com abas (Descrição + Medidas)
- ✅ 9 produtos com copy persuasivo e diagramas SVG
- ✅ Integração WhatsApp para pedidos
- ✅ Design de luxo (bege, coral, azul)
- ✅ Responsividade mobile
- ✅ Sem banco de dados (JSON estático)
- ✅ Hospedagem gratuita (Netlify)

---

## 🏗️ Arquitetura Técnica

### Stack
- **Frontend**: React 19 + Tailwind CSS 4 + shadcn/ui
- **Roteamento**: Wouter (leve)
- **Dados**: JSON estático (`products.json`)
- **Hospedagem**: Netlify (gratuito)
- **Build**: Vite

### Estrutura de Arquivos
```
aurora-baby-boutique/
├── client/
│   ├── public/
│   │   └── images/
│   │       ├── products/          ← Fotos dos produtos
│   │       └── diagrams/          ← Diagramas SVG de medidas
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx         ← Navegação
│   │   │   ├── ProductCard.tsx    ← Card do produto
│   │   │   └── ProductModal.tsx   ← Modal detalhado
│   │   ├── pages/
│   │   │   └── Home.tsx           ← Página principal
│   │   ├── data/
│   │   │   └── products.json      ← Dados dos produtos
│   │   ├── App.tsx                ← Roteamento
│   │   └── index.css              ← Estilos globais
│   └── index.html
├── ARQUITETURA_BOUTIQUE.md        ← Guia completo de arquitetura
├── GUIA_MANUTENCAO.md             ← Como editar produtos
└── package.json
```

---

## 🎨 Design System

### Paleta de Cores
| Nome | Hex | Uso |
|------|-----|-----|
| Base BG | `#FDEBC8` | Fundo geral (bege quente) |
| Accent Coral | `#F7B6B3` | Títulos, destaques |
| Accent Blue | `#B9E0F9` | Botões secundários |
| Accent Yellow | `#FDD692` | Detalhes, hover |
| Soft Brown | `#524330` | Texto principal |

### Tipografia
- **Logo AURORA**: Lemon Friday (cursiva)
- **Logo BABY**: Milky Cookies (cursiva)
- **Títulos**: Comfortaa (sans-serif, bold)
- **Corpo**: Quicksand (sans-serif, regular)

---

## 📦 Estrutura de Dados (products.json)

Cada produto segue este schema:

```json
{
  "id": "manta",
  "name": "Manta",
  "price": 118,
  "category": "mantas",
  "description": {
    "emotional": "Descrição que vende o sonho...",
    "composition": [
      "Tecido Fustão 100% Algodão",
      "Forro em Percal 400 fios"
    ]
  },
  "specifications": {
    "contains": "1 Manta",
    "dimensions": {
      "width": 95,
      "height": 95,
      "unit": "cm"
    },
    "weight": "~600g",
    "material": "Algodão 100%",
    "care": "Lavar em água morna, secar à sombra"
  },
  "images": {
    "main": "/images/products/manta.jpg",
    "gallery": ["/images/products/manta-1.jpg"]
  },
  "diagram": "/images/diagrams/manta-medidas.svg",
  "whatsappMessage": "Olá! Gostaria de pedir a Manta (R$ 118,00)..."
}
```

---

## 🚀 Deployment

### Opção 1: Netlify (Recomendado)
1. Faça push do código para GitHub
2. Conecte o repositório ao Netlify
3. Netlify faz deploy automático a cada push

### Opção 2: Vercel
1. Conecte o repositório ao Vercel
2. Configure build: `pnpm build`
3. Output: `dist`

### Opção 3: Hospedagem Manual
```bash
# Build
pnpm build

# Resultado em: dist/
# Faça upload da pasta 'dist' para seu servidor
```

---

## 🔧 Desenvolvimento Local

### Requisitos
- Node.js 18+
- pnpm (ou npm/yarn)

### Instalação
```bash
cd aurora-baby-boutique
pnpm install
```

### Executar localmente
```bash
pnpm dev
```
Acesse: `http://localhost:3000`

### Build para produção
```bash
pnpm build
pnpm preview
```

---

## 📝 Como Editar Produtos

Veja o arquivo **`GUIA_MANUTENCAO.md`** para instruções passo a passo.

**Resumo rápido:**
1. Abra `client/src/data/products.json`
2. Edite nome, preço, descrição
3. Salve o arquivo
4. Faça commit no GitHub
5. Netlify faz deploy automático

---

## 🎯 UX do Modal

Quando o usuário clica em um produto:

1. **Modal abre** com 2 abas
2. **Aba 1: Descrição**
   - Parágrafo emocional
   - Lista de composição (materiais)
   - Botão "Pedir no WhatsApp"
3. **Aba 2: Medidas**
   - Diagrama SVG com dimensões
   - Especificações técnicas (peso, cuidados)
   - Botão "Pedir no WhatsApp"

---

## 🌐 Fluxo de Conversão

```
Usuário entra no site
    ↓
Vê cards de produtos
    ↓
Clica em um card
    ↓
Modal abre com descrição emocional + foto
    ↓
Lê composição técnica
    ↓
Clica na aba "Medidas"
    ↓
Vê diagrama visual + especificações
    ↓
Clica "Pedir no WhatsApp"
    ↓
WhatsApp abre com mensagem pré-preenchida
    ↓
Mãe/tia responde e fecha a venda
```

---

## 🔐 Segurança & Performance

- ✅ Sem banco de dados (sem vulnerabilidades SQL)
- ✅ Sem API backend (sem pontos de falha)
- ✅ Hospedagem estática (rápida)
- ✅ HTTPS automático (Netlify)
- ✅ CDN global (rápido em qualquer lugar)

---

## 📱 Responsividade

O site é totalmente responsivo:
- **Mobile**: 320px+
- **Tablet**: 640px+
- **Desktop**: 1024px+

Testado em:
- Chrome, Firefox, Safari
- iPhone, Android
- Tablets

---

## 🎓 Tecnologias Usadas

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| React | 19 | Framework |
| Tailwind CSS | 4 | Estilos |
| shadcn/ui | Latest | Componentes UI |
| Wouter | 3.3.5 | Roteamento |
| Vite | 7.1.7 | Build tool |
| TypeScript | 5.6.3 | Type safety |

---

## 📞 Suporte & Manutenção

### Para mãe/tia:
- Editar produtos: Veja `GUIA_MANUTENCAO.md`
- Adicionar fotos: Coloque em `client/public/images/products/`
- Publicar mudanças: Faça commit no GitHub

### Para desenvolvedor:
- Adicionar features: Edite componentes em `client/src/`
- Mudar design: Edite `client/src/index.css`
- Adicionar páginas: Crie em `client/src/pages/`

---

## 🚨 Troubleshooting

### Site não atualiza após editar
- Limpe cache do navegador (Ctrl + Shift + Delete)
- Aguarde 1-2 minutos para Netlify fazer deploy
- Verifique se o arquivo foi salvo

### Fotos não aparecem
- Verifique se a foto está em `client/public/images/products/`
- Verifique se o caminho em `products.json` está correto
- Tente usar extensão `.jpg` (não `.jpeg`)

### Modal não abre
- Verifique console do navegador (F12)
- Verifique se `products.json` tem sintaxe correta
- Tente recarregar a página

---

## 📊 Analytics

O site inclui analytics automático via Umami (Manus).

Acesse dashboard em: [Manus Management UI]

---

## 📅 Roadmap Futuro

Possíveis melhorias:
- [ ] Galeria de fotos com zoom
- [ ] Filtros por categoria
- [ ] Sistema de avaliações
- [ ] Carrinho de compras
- [ ] Blog com dicas de enxoval
- [ ] Integração com Instagram Feed

---

## 📄 Licença

Propriedade da Aurora Baby. Todos os direitos reservados.

---

**Versão**: 1.0 | **Data**: 30/01/2026 | **Autor**: Manus Design Engineer
