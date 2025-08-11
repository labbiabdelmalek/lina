import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_URL } from '../api';

function Dashboard() {
  const [titre, setTitre] = useState('');
  const [contenu, setContenu] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [articles, setArticles] = useState([]);
  const [editId, setEditId] = useState(null);
  const imageInputRef = useRef(null);

  const authHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchArticles = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/articles`);
      setArticles(res.data);
    } catch (err) {
      console.error('Erreur de récupération :', err);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('titre', titre);
      formData.append('contenu', contenu);
      if (image) formData.append('image', image);

      if (editId) {
        await axios.put(`${API_URL}/api/articles/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data', ...authHeader() },
        });
        setMessage('✅ Article modifié !');
      } else {
        await axios.post(`${API_URL}/api/articles`, formData, {
          headers: { 'Content-Type': 'multipart/form-data', ...authHeader() },
        });
        setMessage('✅ Article ajouté !');
      }

      setTitre('');
      setContenu('');
      setImage(null);
      setEditId(null);
      if (imageInputRef.current) imageInputRef.current.value = '';
      fetchArticles();
    } catch (err) {
      console.error(err);
      setMessage('❌ Une erreur est survenue.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('❗ Supprimer cet article ?')) return;
    await axios.delete(`${API_URL}/api/articles/${id}`, { headers: authHeader() });
    fetchArticles();
  };

  const handleEdit = (article) => {
    setTitre(article.titre);
    setContenu(article.contenu);
    setEditId(article._id);
    setImage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">{editId ? '✏️ Modifier un article' : '➕ Ajouter un article'}</h2>

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
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button type="submit" className="btn btn-success">
          {editId ? 'Modifier' : 'Enregistrer'}
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
                    src={`${API_URL}/uploads/${article.image}`}
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
