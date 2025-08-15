import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api, { API_URL } from "../api";

function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    let off = false;
    setLoading(true);
    setErreur("");
    api.get(`/api/articles/${id}`)
      .then(res => { if (!off) { setArticle(res.data); setLoading(false); }})
      .catch(err => { if (!off) { setErreur(err.response?.data?.message || "Erreur serveur"); setLoading(false); }});
    return () => { off = true; };
  }, [id]);

  if (loading) return <div className="container py-5">Chargement…</div>;
  if (erreur) return (
    <div className="container py-5">
      <p className="text-danger">{erreur}</p>
      <Link to="/" className="btn btn-secondary mt-3">← Retour</Link>
    </div>
  );

  const imgSrc = article.image?.startsWith("http")
    ? article.image
    : article.image
    ? `${API_URL}/uploads/${article.image}`
    : null;

  return (
    <div className="container py-5">
      <h1 className="mb-3">{article.titre}</h1>
      {imgSrc && (
        <div className="thumb mb-4" style={{ maxWidth: 900 }}>
          <img src={imgSrc} alt={article.titre} loading="lazy" decoding="async" />
        </div>
      )}
      <p>{article.contenu}</p>
      <Link to="/" className="btn btn-secondary mt-3">← Retour</Link>
    </div>
  );
}
export default Article;
