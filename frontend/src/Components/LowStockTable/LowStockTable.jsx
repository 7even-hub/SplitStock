import "./LowStockTable.scss";

export default function LowStockTable({ items, onRestock }) {
  return (
    <div className="low-stock">
      <div className="low-stock__header">
        <h3>
          Attention: Low Stock <span className="low-stock__count">{items.length} Items</span>
        </h3>
        <a href="#inventory" className="low-stock__view-all">View Inventory →</a>
      </div>

      <div className="low-stock__table" role="table">
        <div className="low-stock__row low-stock__row--head" role="row">
          <span role="columnheader">Product Name</span>
          <span role="columnheader">SKU / Category</span>
          <span role="columnheader">Current Stock</span>
          <span role="columnheader">Min. Threshold</span>
          <span role="columnheader">Action</span>
        </div>

        {items.map((item) => (
          <div className="low-stock__row" role="row" key={item.sku}>
            <span className="low-stock__product" role="cell">
              <span className="low-stock__icon" aria-hidden="true">{item.emoji}</span>
              {item.name}
            </span>
            <span className="low-stock__meta" role="cell">
              <span className="low-stock__sku">{item.sku}</span>
              <span className="low-stock__category">{item.category}</span>
            </span>
            <span className={`low-stock__stock low-stock__stock--${item.severity}`} role="cell">
              <span className="low-stock__dot" /> {item.stock}
            </span>
            <span role="cell">{item.threshold}</span>
            <span role="cell">
              <button
                className={`low-stock__action${item.severity === "critical" ? " low-stock__action--urgent" : ""}`}
                onClick={() => onRestock?.(item)}
              >
                {item.severity === "critical" ? "Urgent Restock" : "Restock"}
              </button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}