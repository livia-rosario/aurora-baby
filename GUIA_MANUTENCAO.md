# Aurora Baby Boutique — Guia de Manutenção

## 📖 Para Mãe e Tia: Como Editar o Site

Olá! Este guia é para você que quer atualizar os produtos, preços ou descrições do site sem precisar chamar um programador.

---

## 1️⃣ ONDE ESTÃO OS DADOS DOS PRODUTOS?

Todos os produtos estão em um arquivo chamado **`products.json`** localizado em:

```
client/src/data/products.json
```

Este arquivo contém todas as informações: nome, preço, descrição, medidas, etc.

---

## 2️⃣ COMO EDITAR UM PRODUTO

### Passo 1: Abrir o arquivo
1. Vá até a pasta `client/src/data/`
2. Abra o arquivo `products.json` com um editor de texto (Bloco de Notas, VS Code, etc.)

### Passo 2: Encontrar o produto
Procure pelo nome do produto. Exemplo:

```json
{
  "id": "manta",
  "name": "Manta",
  "price": 118,
  ...
}
```

### Passo 3: Editar o preço
Para mudar o preço, altere o número após `"price"`:

```json
"price": 118  ← Mude este número
```

### Passo 4: Editar a descrição
Para mudar a descrição emocional:

```json
"description": {
  "emotional": "A Manta é a peça que o bebê mais usará..."  ← Mude este texto
}
```

### Passo 5: Salvar
Pressione `Ctrl + S` (ou `Cmd + S` no Mac) para salvar.

---

## 3️⃣ ADICIONAR UM NOVO PRODUTO

### Passo 1: Copiar um produto existente
Abra `products.json` e copie um produto inteiro (do `{` até o `}`).

### Passo 2: Colar no final
Cole antes do último `]` do arquivo.

### Passo 3: Editar os campos
Mude:
- `"id"`: Um nome único (ex: "novo-produto")
- `"name"`: Nome do produto
- `"price"`: Preço
- `"description"`: Descrição emocional
- `"composition"`: Lista de materiais
- `"specifications"`: Medidas, peso, cuidados

### Exemplo:
```json
{
  "id": "novo-produto",
  "name": "Novo Produto",
  "price": 99,
  "category": "acessorios",
  "description": {
    "emotional": "Descrição bonita aqui...",
    "composition": [
      "Material 1",
      "Material 2"
    ]
  },
  "specifications": {
    "contains": "1 Novo Produto",
    "dimensions": {
      "width": 30,
      "height": 40,
      "unit": "cm"
    },
    "weight": "~200g",
    "material": "Algodão 100%",
    "care": "Lavar em água morna"
  },
  "images": {
    "main": "/images/products/novo-produto.jpg",
    "gallery": ["/images/products/novo-produto-1.jpg"]
  },
  "diagram": "/images/diagrams/novo-produto-medidas.svg",
  "whatsappMessage": "Olá! Gostaria de pedir o Novo Produto (R$ 99,00). Qual seria o prazo de entrega?"
}
```

---

## 4️⃣ ADICIONAR FOTOS

### Passo 1: Salvar a foto
Salve a foto da sua peça em:

```
client/public/images/products/
```

Nome sugerido: `nome-do-produto.jpg`

### Passo 2: Atualizar o JSON
No arquivo `products.json`, mude o caminho da foto:

```json
"images": {
  "main": "/images/products/sua-foto.jpg",
  "gallery": ["/images/products/sua-foto-1.jpg"]
}
```

---

## 5️⃣ PUBLICAR AS MUDANÇAS

Depois de editar o arquivo `products.json`:

1. **Salve o arquivo** (Ctrl + S)
2. **Faça um commit no GitHub** (se souber usar Git)
3. **O Netlify vai fazer deploy automático** em poucos segundos
4. **Seu site será atualizado** em tempo real

---

## 6️⃣ ESTRUTURA COMPLETA DO PRODUTO

Cada produto tem estes campos:

| Campo | Exemplo | Descrição |
|-------|---------|-----------|
| `id` | `"manta"` | Identificador único (sem espaços) |
| `name` | `"Manta"` | Nome do produto |
| `price` | `118` | Preço em reais |
| `category` | `"mantas"` | Categoria (mantas, fraldas, etc.) |
| `description.emotional` | `"A Manta é..."` | Texto que vende o sonho |
| `description.composition` | `["Algodão 100%", ...]` | Lista de materiais |
| `specifications.contains` | `"1 Manta"` | O que contém |
| `specifications.dimensions` | `{width: 95, height: 95}` | Tamanho em cm |
| `specifications.weight` | `"~600g"` | Peso aproximado |
| `specifications.material` | `"Algodão 100%"` | Material principal |
| `specifications.care` | `"Lavar em água morna"` | Cuidados |
| `images.main` | `"/images/products/manta.jpg"` | Foto principal |
| `images.gallery` | `[...]` | Fotos adicionais |
| `diagram` | `"/images/diagrams/manta-medidas.svg"` | Diagrama de medidas |
| `whatsappMessage` | `"Olá! Gostaria..."` | Mensagem pré-preenchida no WhatsApp |

---

## 7️⃣ DICAS IMPORTANTES

### ✅ FAÇA:
- Salve o arquivo após cada mudança
- Use descrições emotivas (venda o sonho, não apenas o produto)
- Mantenha a estrutura JSON (não delete `{` ou `}` por acidente)
- Use nomes de arquivo sem espaços (ex: `manta-luxo.jpg`, não `manta luxo.jpg`)

### ❌ NÃO FAÇA:
- Não delete as aspas `"` ou vírgulas `,`
- Não mude a estrutura do JSON (ordem dos campos)
- Não use caracteres especiais em nomes de arquivo
- Não deixe campos vazios (use `""` para vazio)

---

## 8️⃣ EXEMPLO PRÁTICO

### Antes:
```json
{
  "id": "manta",
  "name": "Manta",
  "price": 118,
  ...
}
```

### Depois (mudou preço e descrição):
```json
{
  "id": "manta",
  "name": "Manta Premium",
  "price": 145,
  "description": {
    "emotional": "A Manta Premium agora com bordado especial..."
  }
  ...
}
```

---

## 9️⃣ PRECISA DE AJUDA?

Se algo não funcionar:
1. Verifique se salvou o arquivo
2. Verifique se não deletou nenhuma aspas `"` ou vírgula `,`
3. Tente abrir o arquivo em outro editor de texto
4. Entre em contato com um desenvolvedor

---

**Versão**: 1.0 | **Data**: 30/01/2026

Boa sorte! 🎉
