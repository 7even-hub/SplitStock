import { Search, HelpCircle, Bell, ShoppingBag, TrendingUp, AlertTriangle, Package } from "lucide-react";
import StatCard from "../Components/StatCard/StatCard";
import SalesChart from "../Components/SalesChart/SalesChart";
import QuickActions from "../Components/QuickActions/QuickActions";
import LowStockTable from "../Components/LowStockTable/LowStockTable";
import "./Dashboard.scss";

const WEEK_SALES = [
  { label: "Mon", value: 12000 },
  { label: "Tue", value: 21000 },
  { label: "Wed", value: 15500 },
  { label: "Thu", value: 29000 },
  { label: "Fri", value: 33500 },
  { label: "Sat", value: 24000 },
  { label: "Sun", value: 45200 },
];

const LOW_STOCK_ITEMS = [
  { name: "Eva Water 75cl (Pack)", sku: "BEV-001", category: "Beverages", stock: "2 Packs", threshold: "10 Packs", severity: "critical", emoji: "💧" },
  { name: "Mama Gold Rice 50kg", sku: "GR-042", category: "Grains", stock: "4 Bags", threshold: "5 Bags", severity: "warning", emoji: "🌾" },
  { name: "Morning Fresh 1L", sku: "CL-110", category: "Cleaning", stock: "0 Btls", threshold: "12 Btls", severity: "critical", emoji: "🧴" },
];

export default function Dashboard() {
  const shopName = "Oluwa's Mini-Mart";

  return (
    <div className="dashboard-layout">

      <div className="dashboard-layout__main">
        {/* Top header bar: search + status + icons */}
        <header className="dashboard-header">
          <div className="dashboard-header__search">
            <Search size={16} />
            <input type="text" placeholder="Search inventory, sales..." />
          </div>

          <div className="dashboard-header__right">
            <span className="dashboard-header__status">
              <span className="dashboard-header__status-dot" /> Shop Status: Open
            </span>
            <button className="dashboard-header__icon-btn" aria-label="Help">
              <HelpCircle size={18} />
            </button>
            <button className="dashboard-header__icon-btn dashboard-header__icon-btn--dot" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <img
              className="dashboard-header__avatar"
              src="https://i.pravatar.cc/64"
              alt="Profile"
            />
          </div>
        </header>

        <main className="dashboard-content">
          {/* Greeting */}
          <div className="dashboard-content__greeting">
            <p className="dashboard-content__eyebrow">🌞 Good morning</p>
            <div className="dashboard-content__title-row">
              <h1>{shopName}</h1>
              <span className="dashboard-content__synced">↻ Last synced: Just now</span>
            </div>
          </div>

          {/* Stat cards */}
          <div className="dashboard-content__stats">
            <StatCard
              label="Today's Sales"
              value="₦45,200"
              icon={ShoppingBag}
              tone="blue"
              trend="+12.5% vs yesterday"
              trendDirection="up"
            />
            <StatCard
              label="Today's Profit"
              value="₦12,450"
              icon={TrendingUp}
              tone="green"
              trend="+5.2% vs yesterday"
              trendDirection="up"
            />
            <StatCard
              label="Low Stock"
              value={<><span>8</span> items</>}
              icon={AlertTriangle}
              tone="red"
              note="View all needs restock →"
            />
            <StatCard
              label="Est. Stock Value"
              value="₦1.2M"
              icon={Package}
              tone="blue"
              note="Based on current retail price"
            />
          </div>

          {/* Chart + Quick actions */}
          <div className="dashboard-content__panels">
            <div className="panel">
              <div className="panel__header">
                <div>
                  <h3>Sales Overview</h3>
                  <p className="panel__subtitle">Last 7 Days</p>
                </div>
                <button className="panel__range-btn">📅 This Week</button>
              </div>
              <SalesChart data={WEEK_SALES} />
            </div>

            <QuickActions />
          </div>

          {/* Low stock table */}
          <LowStockTable items={LOW_STOCK_ITEMS} />
        </main>
      </div>
    </div>
  );
}
