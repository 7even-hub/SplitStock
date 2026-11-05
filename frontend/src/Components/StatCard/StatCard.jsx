import "./StatCard.scss";

export default function StatCard({ label, value, icon: Icon, tone = "blue", trend, trendDirection, note }) {
  return (
    <div className="stat-card">
      <div className="stat-card__top">
        <span className="stat-card__label">{label}</span>
        <span className={`stat-card__badge stat-card__badge--${tone}`}>
          <Icon size={16} />
        </span>
      </div>

      <p className="stat-card__value">{value}</p>

      {trend && (
        <p className={`stat-card__trend stat-card__trend--${trendDirection}`}>
          {trendDirection === "up" ? "↗" : "↘"} {trend}
        </p>
      )}

      {note && <p className="stat-card__note">{note}</p>}
    </div>
  );
}