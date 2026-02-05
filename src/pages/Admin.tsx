import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Edit, Package, Save, X, Loader2, History, LayoutDashboard, Settings, Plus, Trash2 } from "lucide-react";
import productsData from "@/data/products.json";

// Configurações de Login
const USERS = [
  { username: "miriam", password: "miriam1965", name: "Miriam" },
  { username: "denize", password: "denize1961", name: "Denize" },
  { username: "admin", password: "admin2026", name: "Lívia" },
];

const GITHUB_REPO = "livia-rosario/aurora-baby";
const FILE_PATH = "src/data/products.json";
const LOG_PATH = "src/data/activity_logs.json";
// Token integrado para tornar o processo invisível
const GITHUB_TOKEN = "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";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  
  const [products, setProducts] = useState(productsData);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "logs">("products");
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const savedUser = sessionStorage.getItem("admin_user");
    if (savedUser) {
      setIsLoggedIn(true);
      setCurrentUser(savedUser);
      loadLogs();
    }
  }, []);

  const loadLogs = async () => {
    try {
      const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${LOG_PATH}`, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
      });
      if (res.ok) {
        const data = await res.json();
        const content = JSON.parse(decodeURIComponent(escape(atob(data.content))));
        setLogs(Array.isArray(content) ? content : []);
      }
    } catch (err) {
      console.error("Erro ao carregar logs:", err);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = USERS.find(u => u.username === username.toLowerCase() && u.password === password);
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user.name);
      sessionStorage.setItem("admin_user", user.name);
      setError("");
      loadLogs();
    } else {
      setError("Usuário ou senha incorretos.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("admin_user");
  };

  const handleEdit = (product: any) => {
    setEditingProduct({ ...product });
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
    setIsSaving(true);
    try {
      const updatedProducts = products.map(p => p.id === editingProduct.id ? editingProduct : p);
      
      const resProd = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
      });
      const fileProdData = await resProd.json();

      const resLog = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${LOG_PATH}`, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
      });
      let currentLogs = [];
      let logSha = null;
      if (resLog.ok) {
        const logData = await resLog.json();
        currentLogs = JSON.parse(decodeURIComponent(escape(atob(logData.content))));
        logSha = logData.sha;
      }

      const newLog = {
        user: currentUser,
        action: `Alterou ${editingProduct.name}`,
        details: `Preço: R$ ${editingProduct.price}`,
        date: new Date().toLocaleString('pt-BR')
      };
      const updatedLogs = [newLog, ...currentLogs].slice(0, 50);

      await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`, {
        method: "PUT",
        headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Update: ${editingProduct.name} by ${currentUser}`,
          content: btoa(unescape(encodeURIComponent(JSON.stringify(updatedProducts, null, 2)))),
          sha: fileProdData.sha,
        }),
      });

      await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${LOG_PATH}`, {
        method: "PUT",
        headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Log: Activity by ${currentUser}`,
          content: btoa(unescape(encodeURIComponent(JSON.stringify(updatedLogs, null, 2)))),
          sha: logSha,
        }),
      });

      setProducts(updatedProducts);
      setLogs(updatedLogs);
      setEditingProduct(null);
      alert("Salvo com sucesso! O site atualizará em breve.");
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

        {activeTab === "products" && (
          <div className="space-y-4">
            <h2 className="text-xl font-heading font-bold text-[#524330] px-2">Catálogo de Produtos</h2>
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden border-none shadow-sm rounded-2xl active:scale-[0.98] transition-transform">
                <div className="flex items-center p-3 gap-4">
                  <img src={product.images.main} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-[#524330] truncate text-base">{product.name}</h3>
                    <p className="text-[#a5daeb] font-bold text-lg">R$ {product.price.toFixed(2)}</p>
                  </div>
                  <Button 
                    onClick={(e) => {
                      e.preventDefault();
                      handleEdit(product);
                    }} 
                    className="bg-[#f5ebe0] hover:bg-[#eddecb] text-[#524330] rounded-xl h-12 w-12 p-0 z-10 relative"
                  >
                    <Edit className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "logs" && (
          <div className="space-y-4">
            <h2 className="text-xl font-heading font-bold text-[#524330] px-2">Histórico de Alterações</h2>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#e5d5c5]">
              {logs.length > 0 ? logs.map((log, i) => (
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
              <CardTitle className="text-lg font-heading text-[#524330]">Editando Produto</CardTitle>
              <Button variant="ghost" onClick={() => setEditingProduct(null)} className="rounded-full"><X /></Button>
            </CardHeader>
            <CardContent className="p-6 space-y-6 flex-grow">
              <div className="flex justify-center mb-4">
                <img src={editingProduct.images.main} className="w-32 h-32 rounded-2xl object-cover shadow-md" />
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#524330]">Nome da Peça</label>
                  <Input value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} className="h-14 rounded-2xl border-[#e5d5c5] text-lg" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#524330]">Preço de Venda (R$)</label>
                  <Input type="number" step="0.01" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} className="h-14 rounded-2xl border-[#e5d5c5] text-lg font-bold text-[#a5daeb]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#524330]">Descrição para o Site</label>
                  <textarea className="w-full min-h-[100px] p-4 rounded-2xl border border-[#e5d5c5] focus:ring-2 focus:ring-[#a5daeb] outline-none text-base" value={editingProduct.description} onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})} />
                </div>
                
                {/* Edição de Especificações (Lista) */}
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
                        <Button 
                          onClick={() => removeSpec(index)} 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-400 hover:text-red-600 p-2"
                        >
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
                Salvar no GitHub
              </Button>
              <Button variant="ghost" onClick={() => setEditingProduct(null)} className="w-full h-12 text-gray-400 font-medium">Cancelar e Voltar</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
