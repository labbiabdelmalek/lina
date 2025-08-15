import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import "./Header.css";

function Header() {
  const isAdmin = !!localStorage.getItem("token");
  const [open, setOpen] = useState(false);

  // ferme le menu si on repasse en desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 992) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const linkCls = ({ isActive }) => "h-link" + (isActive ? " is-active" : "");
  const mLinkCls = ({ isActive }) => "m-link" + (isActive ? " is-active" : "");

  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="nav-wrap">
        {/* Brand */}
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-logo">L</span>
          <span className="brand-name">Lina<span>Blog</span></span>
        </Link>

        {/* Desktop nav */}
        <nav className="nav-desktop">
          <NavLink to="/" className={linkCls} onClick={close}>Accueil</NavLink>
          <NavLink to="/apropos" className={linkCls} onClick={close}>À propos</NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={linkCls} onClick={close}>Admin</NavLink>
          )}
        </nav>

        {/* Actions (desktop) */}
        <div className="actions">
          {isAdmin ? (
            <LogoutButton />
          ) : (
            <Link to="/login" className="btn-primary" onClick={close}>Se connecter</Link>
          )}
        </div>

        {/* Burger à droite */}
        <button
          className={"burger" + (open ? " active" : "")}
          onClick={() => setOpen(v => !v)}
          aria-label="Ouvrir le menu"
          aria-expanded={open}
        >
          <span/><span/><span/>
        </button>
      </div>

      {/* Voile */}
      <div className={"scrim" + (open ? " show" : "")} onClick={close} />

      {/* Drawer mobile */}
      <aside className={"mobile-drawer" + (open ? " show" : "")} role="dialog" aria-modal="true">
        <div className="drawer-head">
          <span>Menu</span>
          <button className="close" onClick={close} aria-label="Fermer">×</button>
        </div>
        <nav className="drawer-nav">
          <NavLink to="/" className={mLinkCls} onClick={close}>Accueil</NavLink>
          <NavLink to="/apropos" className={mLinkCls} onClick={close}>À propos</NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={mLinkCls} onClick={close}>Admin</NavLink>
          )}
        </nav>
        <div className="drawer-actions">
          {isAdmin ? (
            <LogoutButton />
          ) : (
            <Link to="/login" className="btn-primary w-full" onClick={close}>Se connecter</Link>
          )}
        </div>
      </aside>
    </header>
  );
}

export default Header;
