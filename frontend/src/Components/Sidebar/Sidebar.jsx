import { LayoutDashboard, Package, Receipt, ShoppingCart, BarChart3, Settings, Plus } from "lucide-react";
import "./Sidebar.scss";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Inventory", icon: Package },
  { label: "Sales", icon: Receipt },
  { label: "Purchases", icon: ShoppingCart },
  { label: "Reports", icon: BarChart3 },
];

export default function Sidebar({ onRecordSale }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__brand-icon">
          <Package size={20} />
        </span>
        <div className="sidebar__brand-text">
          <p className="sidebar__brand-name">StockSplit</p>
          <p className="sidebar__brand-tag">MINI-MART PRO</p>
        </div>
      </div>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            className={`sidebar__nav-item${active ? " sidebar__nav-item--active" : ""}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar__footer">
        <button className="sidebar__nav-item">
          <Settings size={18} />
          <span>Settings</span>
        </button>

        <button className="sidebar__record-sale" onClick={onRecordSale}>
          <Plus size={16} />
          Record Sale
        </button>
      </div>
    </aside>
  );
}