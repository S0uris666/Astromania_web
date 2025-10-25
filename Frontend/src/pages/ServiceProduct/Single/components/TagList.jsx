import PropTypes from "prop-types";

export const TagList = ({ tags }) => {
  if (!tags.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag} className="badge badge-ghost">
          #{tag}
        </span>
      ))}
    </div>
  );
};

TagList.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

