import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../api'; // adapte le chemin

function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/articles/${id}`);
        if (alive) {
          setArticle(res.data);
          setErr('');
        }
      } catch (e) {
        console.error('Erreur :', e);
        if (alive) setErr("Impossible de charger l'article.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  if (loading) return <div className="container mt-4">Chargement…</div>;
  if (err) return <div className="container mt-4 text-danger">{err}</div>;
  if (!article) return null;

  const dateStr = article.date ? new Date(article.date).toLocaleDateString() : '';

  return (
    <div className="container mt-4">
      <h1>{article.titre}</h1>

      {article.image && (
        <img
          src={`${API_URL}/uploads/${article.image}`}
          alt={article.titre || 'illustration'}
          className="img-fluid mb-3"
        />
      )}

      {/* Si ton contenu est du HTML sûr (issu de ton éditeur/admin) */}
      <div dangerouslySetInnerHTML={{ __html: article.contenu || '' }} />

      <p><small>{dateStr && `Publié le ${dateStr}`}</small></p>
    </div>
  );
}

export default Article;
