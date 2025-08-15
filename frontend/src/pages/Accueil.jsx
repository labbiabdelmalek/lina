import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { API_URL } from "../api";

function Accueil() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/articles");
        setArticles(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="container py-4">Chargement…</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4">Articles récents</h2>

      {articles.length === 0 ? (
        <p>Aucun article pour le moment.</p>
      ) : (
        <div className="row">
          {articles.map((a) => {
            const imgSrc = a.image?.startsWith("http")
              ? a.image
              : a.image
              ? `${API_URL}/uploads/${a.image}`
              : "/no-image.svg";

            return (
              <div className="col-md-4 mb-4" key={a._id}>
                <div className="card h-100 shadow-sm">
                  <Link to={`/article/${a._id}`}>
                    <div className="thumb card-img-top">
                      <img src={imgSrc} alt={a.titre} loading="lazy" decoding="async" />
                    </div>
                  </Link>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-uppercase">{a.titre}</h5>
                    <p className="card-text text-muted mb-4">
                      {(typeof a.contenu === "string" ? a.contenu : "").slice(0, 150)}…
                    </p>
                    <Link to={`/article/${a._id}`} className="btn btn-dark mt-auto">Lire plus</Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Accueil;
