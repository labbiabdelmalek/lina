import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

function Header() {
  const isAdmin = !!localStorage.getItem("token");
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((o) => !o);
  const close = () => setOpen(false);

  const linkCls = ({ isActive }) =>
    "nav-link" + (isActive ? " fw-bold text-primary" : "");

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
      <Link className="navbar-brand" to="/" onClick={close}>
        Lina Blog
      </Link>

      {/* Toggler (بدون Bootstrap JS) */}
      <button
        className="navbar-toggler"
        type="button"
        onClick={toggle}
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className={"collapse navbar-collapse" + (open ? " show" : "")}>
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <NavLink to="/" className={linkCls} onClick={close}>
              Accueil
            </NavLink>
          </li>

     

          <li className="nav-item">
            <NavLink to="/apropos" className={linkCls} onClick={close}>
              À propos
            </NavLink>
          </li>

          {isAdmin ? (
            <>
              <li className="nav-item">
                <NavLink to="/admin" className={linkCls} onClick={close}>
                  Admin
                </NavLink>
              </li>
              <li className="nav-item">
                <LogoutButton />
              </li>
            </>
          ) : (
            <li className="nav-item">
              <NavLink to="/login" className={linkCls} onClick={close}>
                Login
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Header;
