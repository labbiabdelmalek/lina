// src/pages/Dashboard.jsx
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

  // نبني رابط الصور انطلاقًا من baseURL ديال axios instance
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

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("titre", titre);
      formData.append("contenu", contenu);
      if (image) formData.append("image", image); // اسم الحقل يجب أن يكون "image"

      const cfg = { headers: { ...authHeader() } }; // لا تضع Content-Type هنا

      if (editId) {
        await api.put(`/api/articles/${editId}`, formData, cfg);
        setMessage("✅ Article modifié !");
      } else {
        await api.post(`/api/articles`, formData, cfg);
        setMessage("✅ Article ajouté !");
      }

      setTitre("");
      setContenu("");
      setImage(null);
      setEditId(null);
      if (imageInputRef.current) imageInputRef.current.value = "";
      fetchArticles();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "❌ Une erreur est survenue.";
      setMessage(msg);
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

  const handleEdit = (article) => {
    setTitre(article.titre || "");
    setContenu(typeof article.contenu === "string" ? article.contenu : "");
    setEditId(article._id);
    setImage(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">{editId ? "✏️ Modifier un article" : "➕ Ajouter un article"}</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="mb-5">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Titre"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          required
        />
        <textarea
          className="form-control mb-2"
          placeholder="Contenu"
          rows={5}
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          required
        />
        <input
          type="file"
          className="form-control mb-3"
          accept="image/*"
          ref={imageInputRef}
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
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
        articles.map((article) => (
          <div key={article._id} className="card mb-4">
            <div className="row g-0">
              {article.image && (
                <div className="col-md-4">
                  <img
                    src={`${BASE_URL}/uploads/${article.image}`}
                    className="img-fluid rounded-start"
                    alt={article.titre}
                  />
                </div>
              )}
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">{article.titre}</h5>
                  <p className="card-text">
                    {(typeof article.contenu === "string" ? article.contenu : "").substring(0, 100)}…
                  </p>
                  <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(article)}>
                    ✏️ Modifier
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(article._id)}>
                    🗑️ Supprimer
                  </button>
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
