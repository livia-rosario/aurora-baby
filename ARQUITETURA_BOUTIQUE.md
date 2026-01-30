# Aurora Baby Boutique Digital — Arquitetura Completa

## 📋 Sumário Executivo

Este documento detalha a arquitetura técnica e UX para transformar o site da Aurora Baby de um catálogo simples para uma **boutique digital de luxo**. A solução mantém a simplicidade (sem banco de dados), hospedagem gratuita (Netlify), e facilita a manutenção por não-técnicos.

---

## 1️⃣ UX DO DETALHE (Modal/Página de Produto)

### 1.1 Estrutura Visual Proposta

Quando o usuário clica em um card de produto, abre um **modal elegante** (não uma página separada) com a seguinte estrutura em abas/seções:

```
┌─────────────────────────────────────────────────────────┐
│  [X] MANTA LUXO                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Foto Grande]  │  📋 DESCRIÇÃO  │ 📐 MEDIDAS         │
│                 │                │                     │
│  ← →            │  Parágrafo     │ Diagrama SVG       │
│                 │  emocional     │ (70cm x 35cm)      │
│                 │                │                     │
│                 │  ✓ Composição  │ Especificações     │
│                 │  ✓ Materiais   │ - Contém: 01 Manta│
│                 │                │ - Medidas: 95x95cm │
│                 │                │ - Peso: ~500g      │
│                 │                │                     │
│  R$ 118,00      │  [Pedir]       │ [Guia de Tamanhos] │
│                 │                │                     │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Três Abas Principais

#### **Aba 1: Descrição (Padrão Aberta)**
- **Parágrafo Emocional** (2-3 linhas): Vende o sonho, não apenas o produto
  - Exemplo: *"A Manta Luxo é a peça que o bebê mais usará. Proporciona conforto incomparável, aconchego em cada abraço, e é feita com os melhores materiais para a pele sensível do seu filho."*
- **Composição Técnica** (lista com ✓): Materiais nobres, processo
  - Exemplo: *"Tecido Fustão 100% Algodão | Forro em Percal 400 fios | Bordado Manual à Mão"*
- **Botão de Ação**: "Pedir no WhatsApp" (link direto)

#### **Aba 2: Medidas (Com Diagrama)**
- **Diagrama SVG/Imagem**: Desenho retangular com dimensões exatas
  - Mostra visualmente o tamanho (ex: 70cm x 35cm com marcações)
  - Pode incluir comparação com objeto comum (ex: "tamanho de uma folha A4")
- **Especificações Técnicas** (tabela ou lista):
  - Contém: 01 Manta
  - Medidas: 95 x 95 cm
  - Peso: ~500g
  - Material: Algodão 100%
  - Cuidados: Lavar em água morna, secar à sombra

#### **Aba 3: Guia de Tamanhos (Opcional)**
- Comparação entre produtos
- Recomendações de uso por idade
- Dicas de cuidado

### 1.3 Fotos Reais no Modal

**Estratégia de Apresentação:**
1. **Foto Principal** (esquerda): Grande, com zoom ao passar o mouse
2. **Galeria de Miniaturas** (abaixo): 3-4 ângulos diferentes do produto
3. **Efeito de Luxo**: Fundo branco/neutro, iluminação suave, bordas arredondadas com sombra elegante

**Tratamento de Fotos Caseiras:**
- Usar filtro sutil (aumentar contraste, ajustar temperatura de cor)
- Colocar em fundo branco/cinza neutro para parecer profissional
- Adicionar sombra suave embaixo do produto
- Não usar efeitos exagerados (manter naturalidade)

---

## 2️⃣ ESTRUTURA DE DADOS (JSON)

### 2.1 Schema do Produto

```json
{
  "id": "manta-luxo",
  "name": "Manta Luxo",
  "price": 118,
  "category": "mantas",
  "description": {
    "emotional": "A Manta Luxo é a peça que o bebê mais usará. Proporciona conforto incomparável, aconchego em cada abraço, e é feita com os melhores materiais para a pele sensível do seu filho.",
    "composition": [
      "Tecido Fustão 100% Algodão",
      "Forro em Percal 400 fios",
      "Bordado Manual à Mão"
    ]
  },
  "specifications": {
    "contains": "01 Manta",
    "dimensions": {
      "width": 95,
      "height": 95,
      "unit": "cm"
    },
    "weight": "~500g",
    "material": "Algodão 100%",
    "care": "Lavar em água morna, secar à sombra"
  },
  "images": {
    "main": "/images/manta-luxo-main.jpg",
    "gallery": [
      "/images/manta-luxo-1.jpg",
      "/images/manta-luxo-2.jpg",
      "/images/manta-luxo-3.jpg"
    ]
  },
  "diagram": "/images/diagrams/manta-luxo-medidas.svg",
  "whatsappMessage": "Olá! Gostaria de pedir a Manta Luxo (R$ 118,00). Qual seria o prazo?"
}
```

### 2.2 Array de Produtos (Completo)

```json
[
  {
    "id": "jogo-lencol",
    "name": "Jogo de Lençol",
    "price": 189,
    "category": "lencol",
    "description": {
      "emotional": "Durma tranquilo sabendo que seu bebê está envolto em luxo e conforto. Nosso Jogo de Lençol é feito com os melhores materiais para proporcionar noites perfeitas.",
      "composition": [
        "Tecido 100% Algodão",
        "Forro em Percal 400 fios",
        "Bordado Personalizado"
      ]
    },
    "specifications": {
      "contains": "3 peças (1 lençol com elástico, 1 lençol de cima, 1 fronha)",
      "dimensions": { "width": 70, "height": 140, "unit": "cm" },
      "weight": "~800g",
      "material": "Algodão 100%",
      "care": "Lavar em água morna, secar à sombra"
    },
    "images": {
      "main": "/images/jogo-lencol-main.jpg",
      "gallery": ["/images/jogo-lencol-1.jpg", "/images/jogo-lencol-2.jpg"]
    },
    "diagram": "/images/diagrams/jogo-lencol-medidas.svg",
    "whatsappMessage": "Olá! Gostaria de pedir o Jogo de Lençol (R$ 189,00). Qual seria o prazo?"
  },
  {
    "id": "fralda-boca",
    "name": "Fralda de Boca",
    "price": 42,
    "category": "fraldas",
    "description": {
      "emotional": "Pequena mas poderosa. A Fralda de Boca é essencial no dia a dia do bebê, protegendo roupas e oferecendo conforto.",
      "composition": [
        "Tecido 100% Algodão",
        "Forro em Percal",
        "Bordado à Mão"
      ]
    },
    "specifications": {
      "contains": "1 Fralda",
      "dimensions": { "width": 35, "height": 35, "unit": "cm" },
      "weight": "~150g",
      "material": "Algodão 100%",
      "care": "Lavar em água morna, secar à sombra"
    },
    "images": {
      "main": "/images/fralda-boca-main.jpg",
      "gallery": ["/images/fralda-boca-1.jpg"]
    },
    "diagram": "/images/diagrams/fralda-boca-medidas.svg",
    "whatsappMessage": "Olá! Gostaria de pedir a Fralda de Boca (R$ 42,00). Qual seria o prazo?"
  }
]
```

### 2.3 Onde Armazenar os Dados?

**Opção A: JSON Estático (Recomendado)**
- Arquivo `src/data/products.json` no projeto
- Importado no React como módulo
- Vantagem: Sem banco de dados, fácil editar, hospedagem simples
- Desvantagem: Precisa fazer build para atualizar

**Opção B: JSON em URL Externa**
- Arquivo em GitHub Raw ou Vercel KV
- Carregado via `fetch()` no componente
- Vantagem: Atualiza sem rebuild
- Desvantagem: Depende de internet, latência

**Recomendação**: Use **Opção A** (JSON estático) porque:
1. Não precisa de banco de dados
2. Mãe/tia podem editar o arquivo JSON com um editor de texto
3. Hospedagem Netlify faz rebuild automático quando arquivo muda
4. Sem custo extra

---

## 3️⃣ DESIGN SYSTEM (Apresentação Profissional)

### 3.1 Paleta de Cores (Boutique de Luxo)

| Elemento | Cor | Uso |
|----------|-----|-----|
| **Fundo Base** | `#FDEBC8` (Bege Quente) | Fundo geral, transmite aconchego |
| **Primária** | `#F7B6B3` (Coral Suave) | Títulos, destaques, botões principais |
| **Secundária** | `#B9E0F9` (Azul Suave) | Botões secundários, ícones |
| **Accent** | `#FDD692` (Amarelo Suave) | Hover states, bordas, detalhes |
| **Texto** | `#524330` (Marrom Escuro) | Corpo de texto, legibilidade |
| **Fundo Card** | `#FFFFFF` (Branco) | Cards de produto, modais |

### 3.2 Tipografia

| Elemento | Font | Peso | Uso |
|----------|------|------|-----|
| **Logo "AURORA"** | Lemon Friday | Regular | Identidade visual |
| **Logo "BABY"** | Milky Cookies | Regular | Identidade visual |
| **Títulos (H1, H2)** | Comfortaa | Bold (700) | Seções, nomes de produtos |
| **Subtítulos (H3)** | Comfortaa | Medium (500) | Subseções |
| **Corpo** | Quicksand | Regular (400) | Descrições, parágrafos |
| **Ênfase** | Quicksand | SemiBold (600) | Destaque em listas |

### 3.3 Espaçamento & Sombras

| Elemento | Valor | Uso |
|----------|-------|-----|
| **Padding Card** | 2rem (32px) | Interno dos cards |
| **Gap Grid** | 2rem (32px) | Espaço entre cards |
| **Sombra Suave** | `0 4px 6px rgba(82,67,48,0.1)` | Cards, hover |
| **Sombra Forte** | `0 8px 15px rgba(82,67,48,0.1)` | Modais, destaques |
| **Border Radius** | 1rem (16px) | Cards, botões |

### 3.4 Estratégia de Fotos Reais + Luxo

**Problema**: Fotos caseiras podem parecer amadoras perto de descrição "de luxo".

**Solução em 3 Passos**:

1. **Tratamento de Imagem**:
   - Aumentar contraste levemente (+10%)
   - Ajustar temperatura de cor para mais quente
   - Adicionar vigneta suave (sombra nas bordas)
   - Colocar em fundo branco/cinza neutro

2. **Apresentação no Modal**:
   - Foto grande com zoom ao hover
   - Bordas arredondadas + sombra elegante
   - Galeria de miniaturas abaixo
   - Sem efeitos exagerados (manter naturalidade)

3. **Contexto Textual**:
   - Descrição emocional acima da foto
   - Composição técnica ao lado
   - Diagrama de medidas em aba separada
   - Isso "eleva" a percepção da qualidade

**Resultado**: Foto real + texto de luxo = confiança + desejo

---

## 4️⃣ STACK RECOMENDADO

### 4.1 Por Que React/Tailwind (Não Vanilla JS)?

| Aspecto | Vanilla JS | React |
|--------|-----------|-------|
| **Componentes** | Código repetido | Reutilizáveis |
| **Estado Modal** | Manual (show/hide) | Automático (useState) |
| **Manutenção** | Difícil (HTML + JS soltos) | Fácil (componentes isolados) |
| **Escalabilidade** | Limitada | Crescimento fácil |
| **Hospedagem** | Simples | Simples (Netlify) |
| **Custo** | Gratuito | Gratuito |

### 4.2 Stack Final Recomendado

```
Frontend:
├── React 19 (componentes, estado)
├── Tailwind CSS 4 (estilo, responsividade)
├── shadcn/ui (componentes prontos: Dialog, Tabs, etc.)
└── Wouter (roteamento leve)

Dados:
└── JSON estático (products.json)

Hospedagem:
└── Netlify (gratuito, auto-deploy via GitHub)

Ferramentas:
├── Vite (build rápido)
├── TypeScript (segurança de tipos)
└── Prettier (formatação)
```

### 4.3 Por Que NÃO Migrar para Next.js?

- **Custo**: Vercel cobra por deployments
- **Complexidade**: Adiciona server-side rendering desnecessário
- **Manutenção**: Mãe/tia não conseguem mexer
- **Alternativa Melhor**: React + Netlify (gratuito, simples)

---

## 5️⃣ IMPLEMENTAÇÃO (Passo a Passo)

### 5.1 Estrutura de Arquivos

```
aurora-baby-boutique/
├── client/
│   ├── public/
│   │   └── images/
│   │       ├── products/
│   │       │   ├── manta-luxo-main.jpg
│   │       │   ├── fralda-boca-main.jpg
│   │       │   └── ...
│   │       └── diagrams/
│   │           ├── manta-luxo-medidas.svg
│   │           ├── fralda-boca-medidas.svg
│   │           └── ...
│   ├── src/
│   │   ├── data/
│   │   │   └── products.json (Array de produtos)
│   │   ├── components/
│   │   │   ├── ProductCard.tsx (Card clicável)
│   │   │   ├── ProductModal.tsx (Modal detalhado)
│   │   │   ├── ProductTabs.tsx (Abas: Descrição, Medidas)
│   │   │   └── Header.tsx (Navegação)
│   │   ├── pages/
│   │   │   └── Home.tsx (Página principal)
│   │   └── App.tsx
│   └── index.html
└── package.json
```

### 5.2 Componentes Principais

#### **ProductCard.tsx** (Card Clicável)
```tsx
export function ProductCard({ product, onOpen }) {
  return (
    <div 
      onClick={() => onOpen(product)}
      className="bg-white p-8 rounded-2xl shadow-card-clean hover:shadow-lg cursor-pointer transition"
    >
      <h3 className="font-heading text-2xl font-bold text-accent-coral">
        {product.name}
      </h3>
      <p className="text-3xl font-bold text-soft-brown mt-6">
        R$ {product.price}
      </p>
    </div>
  );
}
```

#### **ProductModal.tsx** (Modal Detalhado)
```tsx
export function ProductModal({ product, isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <div className="grid grid-cols-2 gap-8">
          {/* Foto Grande */}
          <div>
            <img 
              src={product.images.main} 
              alt={product.name}
              className="w-full rounded-xl shadow-lg"
            />
          </div>

          {/* Abas: Descrição, Medidas */}
          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description">Descrição</TabsTrigger>
              <TabsTrigger value="measures">Medidas</TabsTrigger>
            </TabsList>

            <TabsContent value="description">
              <p className="text-lg text-soft-brown mb-4">
                {product.description.emotional}
              </p>
              <h4 className="font-heading font-bold mb-2">Composição</h4>
              <ul>
                {product.description.composition.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent-coral" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button 
                className="mt-6 w-full bg-accent-blue hover:bg-blue-400"
                onClick={() => window.location.href = `https://wa.me/5527992941519?text=${encodeURIComponent(product.whatsappMessage)}`}
              >
                Pedir no WhatsApp
              </Button>
            </TabsContent>

            <TabsContent value="measures">
              <img 
                src={product.diagram} 
                alt="Medidas"
                className="w-full mb-4"
              />
              <div className="space-y-2 text-sm text-soft-brown">
                <p><strong>Contém:</strong> {product.specifications.contains}</p>
                <p><strong>Medidas:</strong> {product.specifications.dimensions.width} x {product.specifications.dimensions.height} cm</p>
                <p><strong>Material:</strong> {product.specifications.material}</p>
                <p><strong>Cuidados:</strong> {product.specifications.care}</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

#### **Home.tsx** (Página Principal)
```tsx
import { useState } from 'react';
import products from '@/data/products.json';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <main className="max-w-7xl mx-auto pt-10 pb-20 px-4">
      <section className="pt-6 pb-10 text-center">
        <p className="text-xl sm:text-2xl font-medium font-heading">
          Peças personalizadas com amor para o seu bebê.
        </p>
      </section>

      <section className="pt-16 pb-16">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-center mb-12">
          Catálogo & Valores
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard 
              key={product.id}
              product={product}
              onOpen={setSelectedProduct}
            />
          ))}
        </div>
      </section>

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </main>
  );
}
```

### 5.3 Arquivo JSON (products.json)

Salvar em `client/src/data/products.json` com o schema descrito na seção 2.2.

---

## 6️⃣ FLUXO DO USUÁRIO (Objetivo Final)

```
1. Usuário entra no site
   ↓
2. Vê cards bonitos com nome e preço
   ↓
3. Clica em um card (ex: "Manta Luxo")
   ↓
4. Modal abre com:
   - Foto grande do produto
   - Descrição emocional ("Proporciona conforto incomparável...")
   - Composição técnica (materiais nobres)
   - Botão "Pedir no WhatsApp"
   ↓
5. Clica na aba "Medidas"
   ↓
6. Vê diagrama visual (70cm x 35cm)
   - Especificações técnicas
   - Cuidados de lavagem
   ↓
7. Volta para "Descrição" e clica "Pedir no WhatsApp"
   ↓
8. Abre WhatsApp com mensagem pré-preenchida
   ↓
9. Mãe/tia responde e fecha a venda
```

---

## 7️⃣ MANUTENÇÃO (Para Mãe/Tia)

### 7.1 Adicionar Novo Produto

1. Abrir `client/src/data/products.json` em um editor de texto
2. Copiar um produto existente
3. Mudar `id`, `name`, `price`, descrição, etc.
4. Salvar
5. Fazer commit no GitHub (ou Netlify faz auto-deploy)

### 7.2 Atualizar Preço

1. Abrir `products.json`
2. Mudar valor em `"price": 118`
3. Salvar
4. Deploy automático

### 7.3 Adicionar Foto

1. Salvar foto em `client/public/images/products/`
2. Atualizar `products.json` com novo caminho
3. Salvar e deploy

---

## 8️⃣ RESUMO EXECUTIVO

| Aspecto | Solução |
|--------|---------|
| **UX Modal** | Abas (Descrição + Medidas), foto grande, texto emocional |
| **Dados** | JSON estático em `products.json` |
| **Design** | Cores quentes (bege, coral), tipografia elegante, fotos reais + contexto |
| **Stack** | React + Tailwind + shadcn/ui + Netlify |
| **Custo** | Gratuito (Netlify free tier) |
| **Manutenção** | Editar JSON, fazer commit, Netlify deploy automático |
| **Objetivo** | Usuário lê texto lindo → vê diagrama → clica WhatsApp → venda |

---

## 📞 Próximos Passos

1. ✅ Implementar componentes React (ProductCard, ProductModal, ProductTabs)
2. ✅ Criar arquivo `products.json` com todos os produtos
3. ✅ Adicionar imagens de produtos em `public/images/`
4. ✅ Criar diagramas SVG de medidas
5. ✅ Testar modal em desktop e mobile
6. ✅ Deploy no Netlify
7. ✅ Documentar para mãe/tia como editar `products.json`

---

**Versão**: 1.0 | **Data**: 30/01/2026 | **Autor**: Manus Design Engineer
