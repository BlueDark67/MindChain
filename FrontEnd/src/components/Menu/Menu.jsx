import { useState } from "react";
import { Link } from "react-router-dom";
import "./Menu.css";
import MindChainLogo_2 from '../../../public/Icon-Menu/MindChainLogo_2.png';

const userId = localStorage.getItem("userId");

//adiciona os icons que quiser
const menuItems = [
  { label: "HomePage", icon: "/Icon-Menu/Home.png", href: "/home" },
  { label: "User Panel", icon: "/Icon-Menu/UserPanel.png", href: `/userpage/${userId}` },
  { label: "Activities", icon: "/Icon-Menu/Activity.png", href: "/metrics" },
  { label: "Premium", icon: "/Icon-Menu/Premium.png", href: "/premium" },
  { label: "About Us", icon: "/Icon-Menu/AboutUs.png", href: "/aboutus" },
  { label: "Log out", icon: "/Icon-Menu/Logout.png", href: "/logout" },
];

const Sidebar = () => {
  
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sidebar-container">
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "sidebar-open" : "sidebar-closed"}`}>
        {/* Botão de abrir/fechar */}
        <div className={`sidemenu ${isOpen ? "menu-open" : "menu-closed"}`} onClick={() => setIsOpen(!isOpen)}>
          {/**Se tiver aberto aparece a imagem de aberto, se nao aparece a imagem de fechado*/}
          {isOpen ? (
            <img src="/Icon-Menu/Icon_Menu_Aberto.png" alt="Menu" />
          ) : (
            <img src="/Icon-Menu/Icon_Menu_Fechado.png" alt="Menu" />
          )}
        </div>

        <div className="header">
          <div className={`logo-do-demonio ${isOpen ? "logo-open" : "logo-closed"}`}>
            <img src={MindChainLogo_2} alt="Logo" />
            {isOpen && <span>MINDCHAIN</span>}
          </div>
        </div>
        {/**Quando o menu ta fechado os botoes nao funcinam (só o de abrir é que funciona como é obvio) */}
        <nav className="nav">
          {menuItems.map((item, index) => (
            <Link
              to={item.href}
              key={index}
              className={`nav-link ${!isOpen ? "disabled-link" : ""}`}
              tabIndex={isOpen ? 0 : -1}
            >
              <div className="nav-item">
                <img src={item.icon} alt={item.label} />
                {isOpen && <span>{item.label}</span>}
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;