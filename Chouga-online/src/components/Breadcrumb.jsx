import { Link } from "react-router-dom";

import "../css/breadcrumb.css";

function Breadcrumb({ items = [] }) {
  if (!items.length) {
    return null;
  }

  return (
    <nav className="breadcrumb" aria-label="Navegação estrutural">
      <ol className="breadcrumb-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          const itemKey = item.path ?? `${item.label}-${index}`;

          return (
            <li
              key={itemKey}
              className="breadcrumb-item"
              aria-current={isLast ? "page" : undefined}
            >
              {item.path && !isLast ? (
                <Link to={item.path}>{item.label}</Link>
              ) : (
                <span>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
