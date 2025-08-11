import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_URL, authHeader } from '../api'; // ajuste le chemin

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
      const res = await axios.get(`${API_URL}/api/articles`);
      setArticles(res.data);
    } catch (err) {
      console.error('Erreur de récupération :', err);
    }
  };

  useEffect(() => { fetchArticles(); }, []);

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

      setTitre(''); setContenu(''); setImage(null); setEditId(null);
      if (imageInputRef.current) imageInputRef.current.value = '';
      fetchArticles();
    } catch (err) {
      console.error(err);
      setMessage('❌ Une erreur est survenue.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('❗ Supprimer cet article ?')) return;
    await axios.delete(`${API_URL}/api/articles/${id}`, { headers: { ...authHeader() } });
    fetchArticles();
  };

  const handleEdit = (a) => {
    setTitre(a.titre); setContenu(a.contenu); setImage(null); setEditId(a._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">{editId ? '✏️ Modifier un article' : '➕ Ajouter un article'}</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="mb-5">
        <input className="form-control mb-3" value={titre} onChange={e=>setTitre(e.target.value)} placeholder="Titre" required />
        <textarea className="form-control mb-3" rows={5} value={contenu} onChange={e=>setContenu(e.target.value)} placeholder="Contenu" required />
        <input ref={imageInputRef} type="file" accept="image/*" className="form-control mb-3" onChange={e=>setImage(e.target.files[0])} />
        <button className="btn btn-success">{editId ? 'Modifier' : 'Enregistrer'}</button>
      </form>

      {message && <div className="alert alert-info">{message}</div>}

      <hr />
      <h3 className="mb-3">🗂️ Articles existants</h3>

      {articles.length === 0 ? <p>Aucun article pour le moment.</p> : articles.map(a => (
        <div key={a._id} className="card mb-4">
          <div className="row g-0">
            {a.image && (
              <div className="col-md-4">
                <img src={`${API_URL}/uploads/${a.image}`} className="img-fluid rounded-start" alt={a.titre} />
              </div>
            )}
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title">{a.titre}</h5>
                <p className="card-text">{a.contenu?.substring(0, 120)}...</p>
                <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(a)}>✏️ Modifier</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(a._id)}>🗑️ Supprimer</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
