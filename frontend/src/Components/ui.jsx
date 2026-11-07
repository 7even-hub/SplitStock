// Small pieces shared by every page

// Page title on the left, optional button on the right
export const PageHead = ({ title, sub, children }) => (
  <header className="head">
    <div>
      <h1>{title}</h1>
      {sub && <p>{sub}</p>}
    </div>
    {children}
  </header>
);

// Coloured pill. tone is "ok" (green) or "warn" (amber)
export const Badge = ({ tone, children }) => (
  <span className={`badge badge--${tone}`}>{children}</span>
);

// One summary card: label, big value, small note
export const Stat = ({ label, value, note, icon: Icon, hero }) => (
  <div className={`card stat ${hero ? 'stat--hero' : ''}`}>
    <div className="stat__top">
      <span>{label}</span>
      {Icon && <Icon size={18} />}
    </div>
    <strong>{value}</strong>
    <small>{note}</small>
  </div>
);