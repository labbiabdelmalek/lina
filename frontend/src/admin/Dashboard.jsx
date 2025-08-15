// src/admin/Dashboard.jsx
import { useState, useEffect, useRef } from "react";
import api from "../api";

function Dashboard() {
  // form state
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [image, setImage] = useState(null);              // ملف جديد للأپلود
  const [preview, setPreview] = useState(null);          // معاينة الصورة قبل الحفظ
  const [currentImage, setCurrentImage] = useState(null);// الصورة الحالية للمقال عند التعديل

  // ui state
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // data state
  const [articles, setArticles] = useState([]);
  const [editId, setEditId] = useState(null);

  const imageInputRef = useRef(null);

  // base url للباك (باش نبنيو مسار /uploads) + توكن
  const BASE_URL = (api.defaults.baseURL || "").replace(/\/$/, "");
  const authHeader = () => {
    const t = localStorage.getItem("token");
    return t ? { Authorization: `Bearer ${t}` } : {};
  };

  // helpers
  const imgSrcFrom = (val) => {
    if (!val) return null;
    return val.startsWith("http") ? val : `${BASE_URL}/uploads/${val}`;
  };

  const resetForm = () => {
    setTitre("");
    setContenu("");
    setImage(null);
    setPreview(null);
    setCurrentImage(null);
    setEditId(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  // fetch list
  const fetchArticles = async () => {
    try {
      const res = await api.get("/api/articles", { headers: { ...authHeader() } });
      setArticles(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("GET /articles:", err);
      setArticles([]);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // submit (create / update) باستعمال fetch + FormData
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("titre", titre);
      fd.append("contenu", contenu);
      if (image) fd.append("image", image); // اسم الحقل "image"

      const url = editId ? `${BASE_URL}/api/articles/${editId}` : `${BASE_URL}/api/articles`;
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: fd,
        headers: { ...authHeader() }, // بلا Content-Type
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || "Erreur serveur");
      }

      setMessage(editId ? "✅ Article modifié !" : "✅ Article ajouté !");
      resetForm();
      await fetchArticles();
    } catch (err) {
      console.error("ADD/EDIT:", err);
      setMessage(`❌ ${err.message || "Une erreur est survenue."}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("❗ Supprimer cet article ?")) return;
    try {
      await api.delete(`/api/articles/${id}`, { headers: authHeader() });
      await fetchArticles();
    } catch (err) {
      console.error("DELETE:", err);
      setMessage("❌ Suppression échouée.");
    }
  };

  const handleEdit = (a) => {
    setTitre(a.titre || "");
    setContenu(typeof a.contenu === "string" ? a.contenu : String(a.contenu || ""));
    setEditId(a._id);
    setImage(null);
    setPreview(null);
    setCurrentImage(a.image ? imgSrcFrom(a.image) : null);
    if (imageInputRef.current) imageInputRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onPickImage = (e) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">{editId ? "✏️ Modifier un article" : "➕ Ajouter un article"}</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="mb-4">
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
          rows={6}
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          required
        />

        <div className="mb-2">
          <input
            type="file"
            className="form-control"
            accept="image/*"
            ref={imageInputRef}
            onChange={onPickImage}
          />
        </div>

        {/* معاينة الصورة */}
        {(preview || currentImage) && (
          <div className="mb-3">
            <small className="text-muted d-block mb-1">
              {preview ? "Prévisualisation:" : "Image actuelle:"}
            </small>
            <img
              src={preview || currentImage}
              alt="preview"
              style={{ maxWidth: "260px", borderRadius: "8px" }}
            />
          </div>
        )}

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? "Veuillez patienter..." : editId ? "Modifier" : "Enregistrer"}
          </button>
          {editId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetForm}
              disabled={loading}
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      {message && <div className="alert alert-info">{message}</div>}

      <hr />
      <h3 className="mb-3">🗂️ Articles existants</h3>

      {/* LIST */}
      {articles.length === 0 ? (
        <p>Aucun article pour le moment.</p>
      ) : (
        articles.map((a) => {
          const img = imgSrcFrom(a.image || "");
          return (
            <div key={a._id} className="card mb-4">
              <div className="row g-0">
                {img && (
                  <div className="col-md-4">
                    <img
                      src={img}
                      className="img-fluid rounded-start"
                      alt={a.titre}
                      style={{ objectFit: "cover", width: "100%", height: "100%" }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )}
                <div className={img ? "col-md-8" : "col-md-12"}>
                  <div className="card-body">
                    <h5 className="card-title">{a.titre}</h5>
                    <p className="card-text">
                      {(typeof a.contenu === "string" ? a.contenu : String(a.contenu || "")).substring(0, 140)}…
                    </p>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-primary" onClick={() => handleEdit(a)}>
                        ✏️ Modifier
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(a._id)}>
                        🗑️ Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Dashboard;
