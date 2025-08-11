import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://lina-beg1.onrender.com' // backend Render
    : 'http://localhost:5000';

function Accueil() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_URL}/api/articles`);
        setArticles(res.data || []);
      } catch (e) {
        console.error('Erreur API :', e);
        setErr("Impossible de charger les articles.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="container mt-4">Chargement…</div>;
  if (err) return <div className="container mt-4 text-danger">{err}</div>;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Articles récents</h1>
      {articles.length === 0 ? (
        <p>Aucun article pour le moment.</p>
      ) : (
        <div className="row">
          {articles.map((article) => (
            <div className="col-md-6 col-lg-4 mb-4" key={article._id}>
              <div className="card h-100">
                {article.image && (
                  <img
                    src={`${API_URL}/uploads/${article.image}`}  // ← plus de localhost
                    className="card-img-top"
                    alt={article.titre}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{article.titre}</h5>
                  <p className="card-text">
                    {(article.contenu || '').substring(0, 100)}…
                  </p>
                  <Link to={`/article/${article._id}`} className="btn btn-primary">
                    Lire plus
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Accueil;
