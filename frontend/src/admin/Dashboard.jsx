import { useState, useEffect, useRef } from "react";
import api from "../api";

function Dashboard() {
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [editId, setEditId] = useState(null);
  const imageInputRef = useRef(null);

  const BASE_URL = (api.defaults.baseURL || "").replace(/\/$/, "");

  const authHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchArticles = async () => {
    try {
      const res = await api.get("/api/articles", { headers: { ...authHeader() } });
      setArticles(res.data);
    } catch (err) {
      console.error("Erreur de récupération :", err);
    }
  };

  useEffect(() => { fetchArticles(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const fd = new FormData();
      fd.append("titre", titre);
      fd.append("contenu", contenu);
      if (image) fd.append("image", image); // اسم الحقل لازم "image"

      const cfg = { headers: { ...authHeader() } }; // لا تضيف Content-Type

      if (editId) {
        await api.put(`/api/articles/${editId}`, fd, cfg);
        setMessage("✅ Article modifié !");
      } else {
        await api.post(`/api/articles`, fd, cfg);
        setMessage("✅ Article ajouté !");
      }

      setTitre(""); setContenu(""); setImage(null); setEditId(null);
      if (imageInputRef.current) imageInputRef.current.value = "";
      fetchArticles();
    } catch (err) {
      console.error("ADD/EDIT:", err.response?.data || err.message);
      setMessage(err.response?.data?.message || "❌ Une erreur est survenue.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("❗ Supprimer cet article ?")) return;
    try {
      await api.delete(`/api/articles/${id}`, { headers: authHeader() });
      fetchArticles();
    } catch (err) {
      console.error(err);
      setMessage("❌ Suppression échouée.");
    }
  };

  const handleEdit = (a) => {
    setTitre(a.titre || "");
    setContenu(typeof a.contenu === "string" ? a.contenu : "");
    setEditId(a._id);
    setImage(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">{editId ? "✏️ Modifier un article" : "➕ Ajouter un article"}</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="mb-5">
        <input className="form-control mb-2" placeholder="Titre" value={titre}
               onChange={(e) => setTitre(e.target.value)} required />
        <textarea className="form-control mb-2" placeholder="Contenu" rows={5} value={contenu}
                  onChange={(e) => setContenu(e.target.value)} required />
        <input type="file" className="form-control mb-3" accept="image/*"
               ref={imageInputRef} onChange={(e) => setImage(e.target.files?.[0] || null)} />
        <button type="submit" className="btn btn-success">
          {editId ? "Modifier" : "Enregistrer"}
        </button>
      </form>

      {message && <div className="alert alert-info">{message}</div>}

      <hr />
      <h3 className="mb-3">🗂️ Articles existants</h3>

      {articles.length === 0 ? (
        <p>Aucun article pour le moment.</p>
      ) : (
        articles.map((a) => (
          <div key={a._id} className="card mb-4">
            <div className="row g-0">
              {a.image && (
                <div className="col-md-4">
                  <img src={`${BASE_URL}/uploads/${a.image}`} className="img-fluid rounded-start" alt={a.titre} />
                </div>
              )}
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">{a.titre}</h5>
                  <p className="card-text">{(typeof a.contenu === "string" ? a.contenu : "").substring(0, 100)}…</p>
                  <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(a)}>✏️ Modifier</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(a._id)}>🗑️ Supprimer</button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
export default Dashboard;
