import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../api'; // chemin depuis src/pages

function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/articles/${id}`)
      .then(res => setArticle(res.data))
      .catch(err => console.error("Erreur :", err));
  }, [id]);

  if (!article) return <div className="container mt-4">Chargement...</div>;

  return (
    <div className="container mt-4">
      <h1>{article.titre}</h1>
      {article.image && (
        <img
          src={`${API_URL}/uploads/${article.image}`}
          alt="illustration"
          className="img-fluid mb-3"
        />
      )}
      <p dangerouslySetInnerHTML={{ __html: article.contenu }}></p>
      <p><small>Publié le {new Date(article.date).toLocaleDateString()}</small></p>
    </div>
  );
}
export default Article;
