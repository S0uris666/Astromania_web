import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

const DEFAULT_TOGGLE_CLASSES =
  "group mt-3 inline-flex items-center gap-2 text-secondary text-xs font-semibold tracking-wide uppercase";

const DEFAULT_ICON_WRAPPER_CLASSES =
  "flex h-5 w-5 items-center justify-center rounded-full border border-secondary transition-transform duration-300";

/**
 * ExpandableText muestra un texto colapsado y agrega un boton
 * para desplegarlo cuando supera el umbral definido.
 */
export function ExpandableText({
  text = "",
  threshold = 140,
  suffix = "...",
  collapsedLines = 3,
  moreLabel = "Ver mas",
  lessLabel = "Ver menos",
  className = "",
  toggleClassName = DEFAULT_TOGGLE_CLASSES,
  iconWrapperClassName = DEFAULT_ICON_WRAPPER_CLASSES,
}) {
  const [expanded, setExpanded] = useState(false);

  const content = useMemo(() => (text ?? "").trim(), [text]);
  const needsToggle = useMemo(
    () => content.length > threshold,
    [content, threshold]
  );

  const truncated = useMemo(() => {
    if (!needsToggle) return content;
    return `${content.slice(0, threshold)}${suffix}`;
  }, [content, needsToggle, suffix, threshold]);

  const displayText = expanded || !needsToggle ? content : truncated;
  const paragraphClass =
    !expanded && collapsedLines
      ? `line-clamp-${collapsedLines}`
      : undefined;

  const handleToggle = () => setExpanded((value) => !value);

  return (
    <div className={className}>
      <p className={paragraphClass}>{displayText}</p>

      {needsToggle && (
        <button
          type="button"
          onClick={handleToggle}
          className={toggleClassName}
          aria-expanded={expanded}
          aria-label={
            expanded
              ? `${lessLabel} descripcion`
              : `${moreLabel} descripcion`
          }
        >
          <span>{expanded ? lessLabel : moreLabel}</span>
          <span
            className={`${iconWrapperClassName} ${
              expanded ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          >
            <ChevronDown className="w-3 h-3" />
          </span>
        </button>
      )}
    </div>
  );
}

