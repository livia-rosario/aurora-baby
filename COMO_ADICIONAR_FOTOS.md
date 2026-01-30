# Como Adicionar Fotos com Medidas — Aurora Baby

## 📸 Estrutura do Carrossel

O novo modal tem um **carrossel simples** que alterna entre:
1. **Foto com Medidas** (foto + medidas escritas)
2. **Foto Real** (foto do produto)

Você pode adicionar quantas fotos quiser. Elas aparecerão como miniaturas embaixo da imagem principal.

---

## 🎯 Passo a Passo para Adicionar Fotos

### Passo 1: Preparar as Fotos
1. Tire uma **foto bonita do produto** (foto real)
2. Crie uma **imagem com as medidas escritas** (pode ser no Canva, Photoshop ou até Paint)
   - Escreva as dimensões (ex: "35cm x 35cm")
   - Deixe a imagem clara e legível

### Passo 2: Salvar as Fotos
Salve as fotos em:
```
client/public/images/products/
```

**Nomes sugeridos:**
- `pano-boca.jpg` (foto real)
- `pano-boca-medidas.jpg` (foto com medidas)

### Passo 3: Editar o JSON
Abra `client/src/data/products.json` e encontre o produto.

**Antes:**
```json
{
  "id": "fralda-boca",
  "name": "Pano de Boca",
  "images": {
    "main": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=500&fit=crop",
    "gallery": ["https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=500&fit=crop"]
  }
}
```

**Depois:**
```json
{
  "id": "fralda-boca",
  "name": "Pano de Boca",
  "images": {
    "main": "/images/products/pano-boca-medidas.jpg",
    "gallery": ["/images/products/pano-boca.jpg"]
  }
}
```

### Passo 4: Salvar e Publicar
1. Salve o arquivo JSON
2. Faça commit no GitHub
3. Netlify faz deploy automático

---

## 📋 Estrutura do JSON Simplificado

```json
{
  "id": "fralda-boca",
  "name": "Pano de Boca",
  "price": 42,
  "category": "Cuidados Infantis",
  "description": "Descrição carinhosa aqui...",
  "specs": [
    "100% algodão puro",
    "Tecido duplo e respirável",
    "52 fios/cm² — muito macio",
    "Medidas: 35cm x 35cm"
  ],
  "images": {
    "main": "/images/products/pano-boca-medidas.jpg",
    "gallery": ["/images/products/pano-boca.jpg"]
  },
  "whatsappMessage": "Olá! Gostaria de pedir o Pano de Boca..."
}
```

---

## 🎨 Dicas para Fotos com Medidas

### Usando Canva (Gratuito)
1. Vá para [canva.com](https://www.canva.com)
2. Crie um design personalizado
3. Importe a foto do produto
4. Adicione um retângulo ou texto com as medidas
5. Baixe como JPG

### Usando Paint (Windows)
1. Abra Paint
2. Importe a foto do produto
3. Use a ferramenta "Texto" para adicionar as medidas
4. Salve como JPG

### Usando Photoshop/GIMP
1. Abra a foto
2. Adicione uma camada de texto com as medidas
3. Exporte como JPG

---

## 📸 Exemplo de Layout para Foto com Medidas

```
┌─────────────────────────────┐
│                             │
│    [FOTO DO PRODUTO]        │
│                             │
│                             │
│    35cm ────────────────    │
│         │                   │
│         │ 35cm              │
│         │                   │
│    ────────────────────     │
│                             │
└─────────────────────────────┘
```

---

## ✅ Checklist para Cada Produto

Para cada produto, você precisa de:

- [ ] Foto real do produto (`produto.jpg`)
- [ ] Foto com medidas (`produto-medidas.jpg`)
- [ ] JSON atualizado com caminhos corretos
- [ ] Descrição carinhosa e direta
- [ ] Specs técnicas em bullets

---

## 🚨 Erros Comuns

### Foto não aparece
- Verifique se o arquivo está em `client/public/images/products/`
- Verifique se o caminho em `products.json` está correto
- Tente usar extensão `.jpg` (não `.png` ou `.jpeg`)

### Miniaturas não aparecem
- Certifique-se de que `gallery` é um array com pelo menos 1 imagem
- Verifique se os caminhos estão corretos

### Carrossel não funciona
- Verifique se `images.main` e `images.gallery` estão preenchidos
- Tente recarregar a página (Ctrl + F5)

---

## 📱 Tamanhos Recomendados

Para melhor qualidade:
- **Largura**: 500-800px
- **Altura**: 500-800px
- **Formato**: JPG (melhor compressão)
- **Tamanho do arquivo**: Menos de 200KB

---

## 🔄 Fluxo Completo

1. Tire foto real do produto
2. Crie imagem com medidas (Canva/Paint/Photoshop)
3. Salve ambas em `client/public/images/products/`
4. Edite `products.json` com os caminhos
5. Salve e faça commit
6. Netlify publica automaticamente

---

**Versão**: 1.0 | **Data**: 30/01/2026

Qualquer dúvida, chame! 🎉
