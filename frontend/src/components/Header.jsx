import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import "./Header.css";

function Header() {
  const isAdmin = !!localStorage.getItem("token");
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);
  const linkCls = ({ isActive }) =>
    "h-link" + (isActive ? " is-active" : "");

  return (
    <header className="site-header">
      <div className="nav-wrap">
        {/* Brand */}
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-logo">L</span>
          <span className="brand-name">
            Lina<span>Blog</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="nav-desktop">
          <NavLink to="/" className={linkCls} onClick={close}>
            Accueil
          </NavLink>

          <NavLink to="/apropos" className={linkCls} onClick={close}>
            À propos
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={linkCls} onClick={close}>
              Admin
            </NavLink>
          )}
        </nav>

        {/* Actions (login / logout) */}
        <div className="actions">
          {isAdmin ? (
            // ton composant rend <button> → on le stylise via .actions :where(a,button)
            <LogoutButton />
          ) : (
            <Link to="/login" className="btn-primary" onClick={close}>
              Se connecter
            </Link>
          )}
        </div>

        {/* Burger */}
        <button
          className={"burger" + (open ? " active" : "")}
          onClick={() => setOpen((v) => !v)}
          aria-label="Ouvrir le menu"
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={"mobile-menu" + (open ? " show" : "")}>
        <NavLink to="/" className={linkCls} onClick={close}>
          Accueil
        </NavLink>

        <NavLink to="/apropos" className={linkCls} onClick={close}>
          À propos
        </NavLink>
        {isAdmin && (
          <NavLink to="/admin" className={linkCls} onClick={close}>
            Admin
          </NavLink>
        )}
        <div className="mobile-actions">
          {isAdmin ? (
            <LogoutButton />
          ) : (
            <Link to="/login" className="btn-primary" onClick={close}>
              Se connecter
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
