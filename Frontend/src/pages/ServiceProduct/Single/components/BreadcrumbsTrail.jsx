import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export const BreadcrumbsTrail = ({ items }) => {
  if (!items.length) return null;

  return (
    <nav className="mt-10 text-sm breadcrumbs opacity-70">
      <ul>
        {items.map((item, index) =>
          item.to ? (
            <li key={`${item.to}-${index}`}>
              <Link to={item.to}>{item.label}</Link>
            </li>
          ) : (
            <li key={`${item.label}-${index}`} className="truncate max-w-[12rem] md:max-w-none">
              {item.label}
            </li>
          )
        )}
      </ul>
    </nav>
  );
};

BreadcrumbsTrail.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      to: PropTypes.string,
    })
  ).isRequired,
};

