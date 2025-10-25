/**
 * @param {{tags: string[]}} props
 */
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

