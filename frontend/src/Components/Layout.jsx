import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Boxes, Receipt, ShoppingCart,
  BarChart3, Settings, Plus, Menu,
} from 'lucide-react';

// The sidebar links. "to" must match the paths in App.jsx
const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/inventory', label: 'Inventory', icon: Boxes },
  { to: '/record-sale', label: 'Sales', icon: Receipt },
  { to: '/purchases', label: 'Purchases', icon: ShoppingCart },
  { to: '/reports-profits', label: 'Reports', icon: BarChart3 },
];

// Sidebar on the left, the current page on the right.
// On phones the sidebar slides in when you tap the menu button.
export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="shell">
      <button className="shell__burger" onClick={() => setOpen(!open)} aria-label="Menu">
        <Menu size={20} />
      </button>

      <aside className={`side ${open ? 'side--open' : ''}`} onClick={() => setOpen(false)}>
        <div className="side__brand">
          <b>StockSplit</b>
          <small>Mini-Mart Pro</small>
        </div>

        <nav>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `side__link ${isActive ? 'is-active' : ''}`}
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </nav>

        <NavLink to="/settings" className="side__link side__settings">
          <Settings size={16} /> Settings
        </NavLink>

        <NavLink to="/record-sale" className="btn btn--primary btn--block">
          <Plus size={16} /> Record Sale
        </NavLink>
      </aside>

      {/* The page for the current address appears here */}
      <main className="shell__main">
        <Outlet />
      </main>
    </div>
  );
}