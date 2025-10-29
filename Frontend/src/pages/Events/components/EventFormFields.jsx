export const EVENT_INPUT_CLASS =
  "w-full input input-bordered input-sm rounded-lg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/40";
export const EVENT_SELECT_CLASS =
  "select select-bordered select-sm rounded-lg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/40";
export const EVENT_TEXTAREA_CLASS =
  "textarea textarea-bordered textarea-sm rounded-lg min-h-28 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/40";

export function EventSectionTitle({ icon = "✨", title, subtitle }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <span className="text-sm">{icon}</span>
      </div>
      <div className="flex-1">
        <h2 className="text-lg font-semibold tracking-tight">
          <span className="bg-secondary bg-clip-text text-transparent">
            {title}
          </span>
        </h2>
        {subtitle && <p className="text-xs opacity-70 mt-0.5">{subtitle}</p>}
        <div className="h-1 w-16 rounded-full bg-primary/30 mt-3" />
      </div>
    </div>
  );
}

export function EventRow({ label, children, htmlFor }) {
  return (
    <div className="md:relative">
      <label
        htmlFor={htmlFor}
        className="label md:absolute md:left-0 md:top-1 md:w-56 pb-0"
      >
        <span className="label-text text-sm font-medium opacity-90">
          {label}
        </span>
      </label>
      <div className="md:ml-56">{children}</div>
    </div>
  );
}

export function EventField({ id, label, error, hint, ...inputProps }) {
  const className = `${EVENT_INPUT_CLASS} ${error ? "input-error" : ""}`;
  return (
    <EventRow label={label} htmlFor={id}>
      <div className="form-control gap-1.5">
        <input id={id} className={className} {...inputProps} />
        <div className="flex justify-between">
          {hint ? <span className="text-xs opacity-60">{hint}</span> : <span />}
          {error ? <span className="text-error text-xs">{error}</span> : null}
        </div>
      </div>
    </EventRow>
  );
}

export function EventFieldArea({ id, label, error, hint, ...areaProps }) {
  const className = `${EVENT_TEXTAREA_CLASS} ${
    error ? "textarea-error" : ""
  }`;
  return (
    <EventRow label={label} htmlFor={id}>
      <div className="form-control gap-1.5">
        <textarea id={id} className={className} {...areaProps} />
        <div className="flex justify-between">
          {hint ? <span className="text-xs opacity-60">{hint}</span> : <span />}
          {error ? <span className="text-error text-xs">{error}</span> : null}
        </div>
      </div>
    </EventRow>
  );
}

export function EventFieldSelect({
  id,
  label,
  error,
  children,
  ...selectProps
}) {
  const className = `${EVENT_SELECT_CLASS} ${error ? "select-error" : ""}`;
  return (
    <EventRow label={label} htmlFor={id}>
      <div className="form-control gap-1.5">
        <select id={id} className={className} {...selectProps}>
          {children}
        </select>
        {error ? <span className="text-error text-xs">{error}</span> : null}
      </div>
    </EventRow>
  );
}

export function EventFieldToggle({
  label,
  checked,
  onChange,
  textRight = "Activar",
}) {
  return (
    <EventRow label={label}>
      <label className="label cursor-pointer justify-start gap-3">
        <input
          type="checkbox"
          className="toggle toggle-sm toggle-primary"
          checked={checked}
          onChange={onChange}
        />
        <span className="label-text text-sm">{textRight}</span>
      </label>
    </EventRow>
  );
}

