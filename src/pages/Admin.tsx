import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Edit, Save, X, Loader2, History, LayoutDashboard, Plus, Trash2, Database, Trash } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import initialProducts from "../data/products.json";

const USERS = [
  { username: "miriam", password: "miriam1965", name: "Miriam" },
  { username: "denize", password: "denize1961", name: "Denize" },
  { username: "admin", password: "admin2026", name: "Lívia" },
];

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  
  const products = useQuery(api.aurora.getProducts);
  const logs = useQuery(api.aurora.getLogs);
  const updateProduct = useMutation(api.aurora.updateProduct);
  const addProduct = useMutation(api.aurora.addProduct);
  const deleteProduct = useMutation(api.aurora.deleteProduct);
  const addLog = useMutation(api.aurora.addLog);
  const seedProducts = useMutation(api.aurora.seedProducts);

  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "logs">("products");

  useEffect(() => {
    const savedUser = sessionStorage.getItem("admin_user");
    if (savedUser) {
      setIsLoggedIn(true);
      setCurrentUser(savedUser);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = USERS.find(u => u.username === username.toLowerCase() && u.password === password);
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user.name);
      sessionStorage.setItem("admin_user", user.name);
      setError("");
    } else {
      setError("Usuário ou senha incorretos.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("admin_user");
  };

  const handleSeed = async () => {
    if (confirm("Deseja importar os produtos do arquivo JSON para o Banco de Dados?")) {
      try {
        await seedProducts({ items: initialProducts });
        alert("Produtos importados com sucesso!");
      } catch (err: any) {
        alert("Erro na importação: " + err.message);
      }
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct({ ...product });
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setEditingProduct({
      id: `prod-${Date.now()}`,
      name: "",
      price: 0,
      category: "Geral",
      description: "",
      specs: [""],
      images: {
        main: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=500&fit=crop",
        gallery: []
      },
      whatsappMessage: ""
    });
    setIsAddingNew(true);
  };

  const handleDelete = async (id: any, name: string) => {
    if (confirm(`Tem certeza que deseja excluir o produto "${name}"?`)) {
      try {
        await deleteProduct({ id });
        await addLog({
          user: currentUser,
          action: `Excluiu o produto ${name}`,
          details: "-",
          date: new Date().toLocaleString('pt-BR')
        });
      } catch (err: any) {
        alert("Erro ao excluir: " + err.message);
      }
    }
  };

  const handleSpecChange = (index: number, value: string) => {
    const newSpecs = [...editingProduct.specs];
    newSpecs[index] = value;
    setEditingProduct({ ...editingProduct, specs: newSpecs });
  };

  const addSpec = () => {
    setEditingProduct({ ...editingProduct, specs: [...editingProduct.specs, ""] });
  };

  const removeSpec = (index: number) => {
    const newSpecs = editingProduct.specs.filter((_: any, i: number) => i !== index);
    setEditingProduct({ ...editingProduct, specs: newSpecs });
  };

  const handleSaveProduct = async () => {
    if (!editingProduct.name || editingProduct.price <= 0) {
      alert("Por favor, preencha o nome e um preço válido.");
      return;
    }

    setIsSaving(true);
    try {
      if (isAddingNew) {
        const whatsappMessage = `Olá! Gostaria de pedir o ${editingProduct.name} (R$ ${editingProduct.price.toFixed(2)}). Qual seria o prazo de entrega?`;
        await addProduct({
          ...editingProduct,
          whatsappMessage: editingProduct.whatsappMessage || whatsappMessage
        });
        await addLog({
          user: currentUser,
          action: `Criou o produto ${editingProduct.name}`,
          details: `Preço inicial: R$ ${editingProduct.price}`,
          date: new Date().toLocaleString('pt-BR')
        });
      } else {
        await updateProduct({
          id: editingProduct._id,
          name: editingProduct.name,
          price: editingProduct.price,
          description: editingProduct.description,
          specs: editingProduct.specs,
          category: editingProduct.category,
        });

        await addLog({
          user: currentUser,
          action: `Alterou ${editingProduct.name}`,
          details: `Preço: R$ ${editingProduct.price}`,
          date: new Date().toLocaleString('pt-BR')
        });
      }

      setEditingProduct(null);
      alert("Salvo com sucesso!");
    } catch (err: any) {
      alert("Erro ao salvar: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf8f3] px-4">
        <Card className="w-full max-w-md shadow-xl border-none rounded-3xl overflow-hidden">
          <CardHeader className="text-center pb-2 pt-8">
            <img src="/images/logo.png" alt="Aurora Baby" className="h-16 mx-auto mb-4" />
            <CardTitle className="text-2xl font-heading text-[#524330]">Área das Meninas ✨</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Usuário" className="rounded-2xl border-[#e5d5c5] h-14 text-lg" />
              </div>
              <div className="space-y-2">
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" className="rounded-2xl border-[#e5d5c5] h-14 text-lg" />
              </div>
              {error && <p className="text-red-500 text-sm italic text-center">{error}</p>}
              <Button type="submit" className="w-full bg-[#a5daeb] hover:bg-[#8ecce0] text-[#524330] font-bold rounded-2xl h-14 text-lg shadow-lg">Entrar no Painel</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f3] flex flex-col">
      <header className="bg-white border-b px-4 py-3 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <img src="/images/logo.png" alt="Aurora Baby" className="h-8" />
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#524330] bg-[#f5ebe0] px-3 py-1 rounded-full">Olá, {currentUser}</span>
          <Button onClick={handleLogout} variant="ghost" size="sm" className="text-red-500 p-2"><LogOut className="w-5 h-5" /></Button>
        </div>
      </header>

      <main className="flex-grow max-w-3xl mx-auto w-full p-4 pb-32">
        <div className="flex bg-white rounded-2xl p-1 mb-6 shadow-sm border border-[#e5d5c5]">
          <button onClick={() => setActiveTab("products")} className={`flex-1 flex items-center justify-center py-3 rounded-xl transition-all ${activeTab === 'products' ? 'bg-[#a5daeb] text-[#524330] font-bold shadow-inner' : 'text-gray-400'}`}>
            <LayoutDashboard className="w-5 h-5 mr-2" /> <span className="text-sm">Produtos</span>
          </button>
          <button onClick={() => setActiveTab("logs")} className={`flex-1 flex items-center justify-center py-3 rounded-xl transition-all ${activeTab === 'logs' ? 'bg-[#a5daeb] text-[#524330] font-bold shadow-inner' : 'text-gray-400'}`}>
            <History className="w-5 h-5 mr-2" /> <span className="text-sm">Atividade</span>
          </button>
        </div>

        {!products ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#a5daeb]" />
            <p className="animate-pulse">Sincronizando com o banco de dados...</p>
          </div>
        ) : activeTab === "products" ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-xl font-heading font-bold text-[#524330]">Catálogo de Produtos</h2>
              <div className="flex gap-2">
                {products.length === 0 && (
                  <Button onClick={handleSeed} variant="outline" size="sm" className="rounded-full border-[#a5daeb] text-[#524330]">
                    <Database className="w-4 h-4 mr-2" /> Importar Inicial
                  </Button>
                )}
                <Button onClick={handleAddNew} className="bg-[#a5daeb] hover:bg-[#8ecce0] text-[#524330] rounded-full h-10 px-4 font-bold text-sm">
                  <Plus className="w-4 h-4 mr-2" /> Novo Produto
                </Button>
              </div>
            </div>
            {products.map((product) => (
              <Card key={product._id} className="overflow-hidden border-none shadow-sm rounded-2xl active:scale-[0.98] transition-transform">
                <div className="flex items-center p-3 gap-4">
                  <img src={product.images.main} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-[#524330] truncate text-base">{product.name}</h3>
                    <p className="text-[#a5daeb] font-bold text-lg">R$ {product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleEdit(product)} 
                      className="bg-[#f5ebe0] hover:bg-[#eddecb] text-[#524330] rounded-xl h-12 w-12 p-0"
                    >
                      <Edit className="w-5 h-5" />
                    </Button>
                    <Button 
                      onClick={() => handleDelete(product._id, product.name)} 
                      variant="ghost"
                      className="text-red-400 hover:text-red-600 rounded-xl h-12 w-12 p-0"
                    >
                      <Trash className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-heading font-bold text-[#524330] px-2">Histórico de Alterações</h2>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#e5d5c5]">
              {logs && logs.length > 0 ? logs.map((log: any, i: number) => (
                <div key={i} className="p-4 border-b last:border-none flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#a5daeb] mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-[#524330]"><strong>{log.user}</strong> {log.action}</p>
                    <p className="text-xs text-gray-400 mt-1">{log.date} • {log.details}</p>
                  </div>
                </div>
              )) : (
                <div className="p-10 text-center text-gray-400 italic">Nenhuma atividade registrada ainda.</div>
              )}
            </div>
          </div>
        )}
      </main>

      {editingProduct && (
        <div className="fixed inset-0 bg-white sm:bg-black/50 flex items-end sm:items-center justify-center z-[100] overflow-hidden">
          <Card className="w-full max-w-2xl h-[92vh] sm:h-auto sm:max-h-[90vh] overflow-y-auto border-none rounded-t-[32px] sm:rounded-3xl shadow-2xl flex flex-col">
            <div className="h-1.5 w-12 bg-gray-200 mx-auto mt-3 rounded-full sm:hidden" />
            <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
              <CardTitle className="text-lg font-heading text-[#524330]">
                {isAddingNew ? "Novo Produto" : "Editando Produto"}
              </CardTitle>
              <Button variant="ghost" onClick={() => setEditingProduct(null)} className="rounded-full"><X /></Button>
            </CardHeader>
            <CardContent className="p-6 space-y-6 flex-grow">
              <div className="flex flex-col items-center mb-4 gap-2">
                <img src={editingProduct.images.main} className="w-32 h-32 rounded-2xl object-cover shadow-md" />
                <div className="w-full max-w-sm">
                  <label className="text-xs font-bold text-gray-400 uppercase">Link da Imagem Principal</label>
                  <Input 
                    value={editingProduct.images.main} 
                    onChange={(e) => setEditingProduct({...editingProduct, images: {...editingProduct.images, main: e.target.value}})} 
                    className="h-10 rounded-xl border-[#e5d5c5] text-xs" 
                    placeholder="URL da imagem (ex: /images/products/item.jpg)"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#524330]">Nome da Peça</label>
                  <Input value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} className="h-14 rounded-2xl border-[#e5d5c5] text-lg" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#524330]">Preço de Venda (R$)</label>
                    <Input type="number" step="0.01" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} className="h-14 rounded-2xl border-[#e5d5c5] text-lg font-bold text-[#a5daeb]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#524330]">Categoria</label>
                    <Input value={editingProduct.category} onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})} className="h-14 rounded-2xl border-[#e5d5c5] text-lg" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#524330]">Descrição para o Site</label>
                  <textarea className="w-full min-h-[100px] p-4 rounded-2xl border border-[#e5d5c5] focus:ring-2 focus:ring-[#a5daeb] outline-none text-base" value={editingProduct.description} onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})} />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-[#524330]">Especificações (Lista)</label>
                    <Button onClick={addSpec} variant="outline" size="sm" className="rounded-full h-8 px-3 text-xs border-[#a5daeb] text-[#524330]">
                      <Plus className="w-3 h-3 mr-1" /> Adicionar
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {editingProduct.specs.map((spec: string, index: number) => (
                      <div key={index} className="flex gap-2">
                        <Input 
                          value={spec} 
                          onChange={(e) => handleSpecChange(index, e.target.value)} 
                          className="h-10 rounded-xl border-[#e5d5c5] text-sm"
                          placeholder="Ex: 100% Algodão"
                        />
                        <Button onClick={() => removeSpec(index)} variant="ghost" size="sm" className="text-red-400 hover:text-red-600 p-2">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="p-6 bg-gray-50 border-t flex flex-col gap-3">
              <Button onClick={handleSaveProduct} disabled={isSaving} className="w-full bg-[#a5daeb] hover:bg-[#8ecce0] text-[#524330] font-bold h-16 rounded-2xl text-lg shadow-lg">
                {isSaving ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <Save className="w-6 h-6 mr-2" />}
                {isAddingNew ? "Criar Novo Produto" : "Salvar Alterações"}
              </Button>
              <Button variant="ghost" onClick={() => setEditingProduct(null)} className="w-full h-12 text-gray-400 font-medium">Cancelar e Voltar</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
