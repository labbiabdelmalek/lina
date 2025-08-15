// src/pages/Article.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";

function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState("");

  const BASE_URL = (api.defaults.baseURL || "").replace(/\/$/, "");

  useEffect(() => {
    let stop = false;
    setLoading(true);
    setErreur("");
    api
      .get(`/api/articles/${id}`)
      .then((res) => {
        if (!stop) {
          setArticle(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!stop) {
          setErreur(err.response?.data?.message || "Erreur serveur");
          setLoading(false);
        }
      });
    return () => { stop = true; };
  }, [id]);

  if (loading) return <div className="container py-5">Chargement…</div>;
  if (erreur) return (
    <div className="container py-5">
      <p className="text-danger">{erreur}</p>
      <Link to="/" className="btn btn-secondary mt-3">← Retour</Link>
    </div>
  );

  return (
    <div className="container py-5">
      <h1 className="mb-3">{article.titre}</h1>
      {article.image && (
        <img
          src={`${BASE_URL}/uploads/${article.image}`}
          alt={article.titre}
          className="img-fluid mb-4"
        />
      )}
      <p>{article.contenu}</p>
      <Link to="/" className="btn btn-secondary mt-3">← Retour</Link>
    </div>
  );
}

export default Article;
