import { useNavigate } from "react-router-dom";
import { ShoppingCart, Truck, RefreshCw, FileText } from "lucide-react";
import "./QuickActions.scss";

// Each button has a "route", which is the page it opens.
// route: null means that page isn't built yet, so the button is disabled.
const ACTIONS = [
  { label: "Record Sale", icon: ShoppingCart, tone: "blue", route: "/record-sale" },
  { label: "Add Purchase", icon: Truck, tone: "grey", route: "/purchases" },
  { label: "Repack Stock", icon: RefreshCw, tone: "grey", route: null },
  { label: "Add Expense", icon: FileText, tone: "red", route: null },
];

export default function QuickActions() {
  // useNavigate gives us a function that moves the user to another page
  const navigate = useNavigate();

  return (
    <div className="quick-actions">
      <h3 className="quick-actions__title">Quick Actions</h3>
      <div className="quick-actions__grid">
        {ACTIONS.map(({ label, icon: Icon, tone, route }) => (
          <button
            key={label}
            className={`quick-actions__btn quick-actions__btn--${tone}`}
            // A button with no route can't be clicked
            disabled={!route}
            // Show a hint when the mouse is over a disabled button
            title={route ? label : "Coming soon"}
            // When clicked, go to the page this button points to
            onClick={() => route && navigate(route)}
          >
            <Icon size={20} />
            <span>{label}</span>
            {/* Only the unfinished buttons show this small note */}
            {!route && <small className="quick-actions__soon">Coming soon</small>}
          </button>
        ))}
      </div>
    </div>
  );
}