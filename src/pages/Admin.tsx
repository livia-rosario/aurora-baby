import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Edit, Package, Save, X, Loader2 } from "lucide-react";
import productsData from "@/data/products.json";

// Configurações de Login
const USERS = [
  { username: "miriam", password: "miriam1965", name: "Miriam" },
  { username: "denize", password: "denize1961", name: "Denize" },
  { username: "admin", password: "admin2026", name: "Lívia" },
];

// Configurações do Repositório (Ajuste se o nome mudar)
const GITHUB_REPO = "livia-rosario/aurora-baby";
const FILE_PATH = "src/data/products.json";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [githubToken, setGithubToken] = useState("");
  
  const [products, setProducts] = useState(productsData);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedUser = sessionStorage.getItem("admin_user");
    const savedToken = localStorage.getItem("gh_token");
    if (savedUser) {
      setIsLoggedIn(true);
      setCurrentUser(savedUser);
    }
    if (savedToken) {
      setGithubToken(savedToken);
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

  const handleSaveToken = () => {
    localStorage.setItem("gh_token", githubToken);
    alert("Chave de acesso salva com sucesso!");
  };

  const handleEdit = (product: any) => {
    setEditingProduct({ ...product });
  };

  const handleSaveProduct = async () => {
    if (!githubToken) {
      alert("Por favor, configure a Chave de Acesso (Token) do GitHub primeiro.");
      return;
    }

    setIsSaving(true);
    try {
      // 1. Obter os dados atualizados
      const updatedProducts = products.map(p => 
        p.id === editingProduct.id ? editingProduct : p
      );

      // 2. Buscar o SHA do arquivo atual no GitHub
      const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`, {
        headers: { Authorization: `token ${githubToken}` }
      });
      const fileData = await res.json();

      if (!fileData.sha) throw new Error("Não foi possível encontrar o arquivo no GitHub.");

      // 3. Fazer o commit via API
      const commitRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`, {
        method: "PUT",
        headers: {
          Authorization: `token ${githubToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Update product: ${editingProduct.name} (via Admin Panel)`,
          content: btoa(JSON.stringify(updatedProducts, null, 2)),
          sha: fileData.sha,
        }),
      });

      if (commitRes.ok) {
        setProducts(updatedProducts);
        setEditingProduct(null);
        alert("Produto atualizado! O site será atualizado em instantes.");
      } else {
        const errorData = await commitRes.json();
        throw new Error(errorData.message || "Erro ao salvar.");
      }
    } catch (err: any) {
      alert("Erro ao salvar: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf8f3] px-4">
        <Card className="w-full max-w-md shadow-xl border-none">
          <CardHeader className="text-center pb-2">
            <img src="/images/logo.png" alt="Aurora Baby" className="h-16 mx-auto mb-4" />
            <CardTitle className="text-2xl font-heading text-[#524330]">Área Administrativa</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#524330]">Usuário</label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Seu usuário" className="rounded-xl border-[#e5d5c5]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#524330]">Senha</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Sua senha" className="rounded-xl border-[#e5d5c5]" />
              </div>
              {error && <p className="text-red-500 text-xs italic">{error}</p>}
              <Button type="submit" className="w-full bg-[#a5daeb] hover:bg-[#8ecce0] text-[#524330] font-bold rounded-xl py-6">Entrar</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f3] pb-20">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <img src="/images/logo.png" alt="Aurora Baby" className="h-8" />
          <span className="hidden sm:inline text-[#524330] font-medium">Olá, {currentUser}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Input 
            type="password" 
            placeholder="GitHub Token" 
            value={githubToken} 
            onChange={(e) => setGithubToken(e.target.value)}
            className="w-32 h-8 text-xs"
          />
          <Button onClick={handleSaveToken} size="sm" variant="outline" className="h-8 text-xs">Salvar Chave</Button>
          <Button onClick={handleLogout} variant="ghost" size="sm" className="text-red-500"><LogOut className="w-4 h-4" /></Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto mt-10 px-4">
        <h1 className="text-3xl font-heading font-bold text-[#524330] mb-8 flex items-center">
          <Package className="w-8 h-8 mr-3 text-[#a5daeb]" /> Gerenciar Catálogo
        </h1>

        <div className="grid gap-4">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden border-none shadow-sm">
              <div className="flex flex-col sm:flex-row items-center p-4 gap-4">
                <img src={product.images.main} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="font-bold text-[#524330]">{product.name}</h3>
                  <p className="text-[#a5daeb] font-bold">R$ {product.price.toFixed(2)}</p>
                </div>
                <Button onClick={() => handleEdit(product)} className="bg-[#f5ebe0] hover:bg-[#eddecb] text-[#524330] rounded-xl"><Edit className="w-4 h-4 mr-2" /> Editar</Button>
              </div>
            </Card>
          ))}
        </div>
      </main>

      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-none">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <CardTitle className="text-xl font-heading text-[#524330]">Editar: {editingProduct.name}</CardTitle>
              <Button variant="ghost" onClick={() => setEditingProduct(null)}><X /></Button>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#524330]">Nome</label>
                  <Input value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#524330]">Preço (R$)</label>
                  <Input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#524330]">Descrição</label>
                <textarea className="w-full min-h-[100px] p-3 rounded-md border border-[#e5d5c5]" value={editingProduct.description} onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})} />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setEditingProduct(null)}>Cancelar</Button>
                <Button onClick={handleSaveProduct} disabled={isSaving} className="bg-[#a5daeb] hover:bg-[#8ecce0] text-[#524330] font-bold px-8">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  Salvar no GitHub
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
