import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_URL } from '../api';

function Accueil() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/articles`)
      .then(res => setArticles(res.data))
      .catch(err => console.error("Erreur API :", err));
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Articles récents....</h1>
      <div className="row">
        {articles.map(article => (
          <div className="col-md-6 col-lg-4 mb-4" key={article._id}>
            <div className="card h-100">
              {article.image && (
                <img
                  src={`${API_URL}/uploads/${article.image}`}
                  className="card-img-top"
                  alt="visuel"
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{article.titre}</h5>
                <p className="card-text">{article.contenu.substring(0, 100)}...</p>
                <Link to={`/article/${article._id}`} className="btn btn-primary">Lire plus</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Accueil;
