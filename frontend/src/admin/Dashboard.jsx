import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function Dashboard() {
  const [titre, setTitre] = useState('');
  const [contenu, setContenu] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [articles, setArticles] = useState([]);
  const [editId, setEditId] = useState(null);

  const imageInputRef = useRef();

  const fetchArticles = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/articles');
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

    try {
      if (editId) {
        // 🔁 Modification avec FormData
        const formData = new FormData();
        formData.append('titre', titre);
        formData.append('contenu', contenu);
        if (image) formData.append('image', image);

        await axios.put(`http://localhost:5000/api/articles/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setMessage("✅ Article modifié !");
      } else {
        // ➕ Ajout
        const formData = new FormData();
        formData.append('titre', titre);
        formData.append('contenu', contenu);
        if (image) formData.append('image', image);

        await axios.post('http://localhost:5000/api/articles', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setMessage("✅ Article ajouté !");
      }

      // 🧹 Réinitialiser le formulaire
      setTitre('');
      setContenu('');
      setImage(null);
      setEditId(null);
      if (imageInputRef.current) imageInputRef.current.value = '';
      fetchArticles();
    } catch (err) {
      console.error(err);
      setMessage("❌ Une erreur est survenue.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("❗ Supprimer cet article ?")) {
      await axios.delete(`http://localhost:5000/api/articles/${id}`);
      fetchArticles();
    }
  };

  const handleEdit = (article) => {
    setTitre(article.titre);
    setContenu(article.contenu);
    setImage(null);
    setEditId(article._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">{editId ? "✏️ Modifier un article" : "➕ Ajouter un article"}</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="mb-5">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Titre"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder="Contenu"
            rows={5}
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <input
            type="file"
            className="form-control"
            accept="image/*"
            ref={imageInputRef}
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <button type="submit" className="btn btn-success">
          {editId ? "Modifier" : "Enregistrer"}
        </button>
      </form>

      {message && (
        <div className="alert alert-info">
          {message}
        </div>
      )}

      <hr />
      <h3 className="mb-3">🗂️ Articles existants</h3>

      {articles.length === 0 ? (
        <p>Aucun article pour le moment.</p>
      ) : (
        articles.map(article => (
          <div key={article._id} className="card mb-4">
            <div className="row g-0">
              {article.image && (
                <div className="col-md-4">
                  <img
                    src={`http://localhost:5000/uploads/${article.image}`}
                    className="img-fluid rounded-start"
                    alt={article.titre}
                  />
                </div>
              )}
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">{article.titre}</h5>
                  <p className="card-text">{article.contenu.substring(0, 100)}...</p>
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
