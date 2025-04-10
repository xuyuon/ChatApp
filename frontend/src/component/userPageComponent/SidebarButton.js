import "./sidebarButton.css";

import { Link } from "react-router-dom";

function SidebarButton({ text, Icon, to, selected, onClick }) {
  return (
    <Link to={to} style={{ textDecoration: "none" }} onClick={onClick}>
      <div className={`button ${selected ? "selected" : ""}`}>
        <Icon />
        <h2>{text}</h2>
      </div>
    </Link>
  );
}

export default SidebarButton;
