import { useState } from 'react';
import { Search, Minus, Plus, Package } from 'lucide-react';
import { products as startProducts, naira } from '../data';
import './RecordSale.scss';

const cats = ['All Items', 'Beverages', 'Snacks', 'Grains', 'Toiletries'];

export default function RecordSale() {
  const [items, setItems] = useState(startProducts); // products with live stock counts
  const [cat, setCat] = useState('All Items');
  const [q, setQ] = useState('');                    // search text
  const [cart, setCart] = useState({});              // { productId: quantity }
  const [held, setHeld] = useState(null);            // a sale put on hold
  const [orderNo, setOrderNo] = useState(24);        // number shown as #SO-0024
  const [message, setMessage] = useState('');        // "sale completed" notice

  // Change a quantity by +1 or -1. Never go above stock; remove the line at 0.
  const change = (p, d) => {
    setMessage('');
    setCart((c) => {
      const n = (c[p.id] || 0) + d;
      const next = { ...c };
      if (n <= 0) delete next[p.id];
      else if (n <= p.stock) next[p.id] = n;
      return next;
    });
  };

  const shown = items.filter(
    (p) => (cat === 'All Items' || p.cat === cat) && p.name.toLowerCase().includes(q.toLowerCase())
  );
  const lines = items.filter((p) => cart[p.id]);
  const total = lines.reduce((sum, p) => sum + p.price * cart[p.id], 0);
  const orderId = `#SO-${String(orderNo).padStart(4, '0')}`;

  // Take the sold quantities off the stock and start a new sale
  const complete = () => {
    setItems(items.map((p) => (cart[p.id] ? { ...p, stock: p.stock - cart[p.id] } : p)));
    setMessage(`Sale ${orderId} completed: ${naira(total)}`);
    setOrderNo(orderNo + 1);
    setCart({});
  };

  // Hold saves the current cart; when the cart is empty the same button brings it back
  const hold = () => {
    if (lines.length) { setHeld(cart); setCart({}); }
    else if (held) { setCart(held); setHeld(null); }
  };

  return (
    <div className="pos">
      {/* Left side: search, categories, product grid */}
      <section>
        <label className="search search--wide">
          <Search size={14} />
          <input placeholder="Search products (SKU, Name)..." value={q} onChange={(e) => setQ(e.target.value)} />
        </label>

        <div className="chips">
          {cats.map((c) => (
            <button key={c} className={`chip ${cat === c ? 'is-active' : ''}`} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>

        <div className="products">
          {shown.map((p) => (
            <button key={p.id} className="card product" onClick={() => change(p, 1)} disabled={p.stock === 0}>
              <div className="product__img">
                <Package size={28} />
                {p.stock < 5 && <em>{p.stock === 0 ? 'Out of stock' : 'Low Stock'}</em>}
              </div>
              <b>{p.name}</b>
              <span className="product__price">{naira(p.price)}</span>
              <small className={p.stock < 5 ? 'danger' : 'muted'}>{p.stock} in stock</small>
            </button>
          ))}
        </div>
      </section>

      {/* Right side: the current sale */}
      <aside className="card cart">
        <div className="cart__title">
          <h2>Current Sale</h2>
          <span className="cart__id">{orderId}</span>
        </div>
        <p className="muted">Customer: Walk-in <a href="#add">Add Customer</a></p>

        {message && <p className="notice">{message}</p>}

        <div className="cart__lines">
          {lines.length === 0 && <p className="muted">Tap a product to add it.</p>}
          {lines.map((p) => (
            <div key={p.id} className="cart__line">
              <div>
                <b>{p.name}</b>
                <small className="muted">{naira(p.price)} / unit</small>
              </div>
              <div className="stepper">
                <button onClick={() => change(p, -1)} aria-label="Remove one"><Minus size={12} /></button>
                <span>{cart[p.id]}</span>
                <button onClick={() => change(p, 1)} aria-label="Add one"><Plus size={12} /></button>
              </div>
              <b>{naira(p.price * cart[p.id])}</b>
            </div>
          ))}
        </div>

        <div className="cart__sum">
          <div><span>Subtotal</span><span>{naira(total)}</span></div>
          <div><span>Tax (0%)</span><span>₦0</span></div>
          <div className="cart__total"><span>Total</span><strong>{naira(total)}</strong></div>
        </div>

        <div className="cart__btns">
          <button className="btn btn--ghost" onClick={hold} disabled={!lines.length && !held}>
            {!lines.length && held ? 'Resume' : 'Hold'}
          </button>
          <button className="btn btn--ghost btn--danger" onClick={() => setCart({})}>Clear</button>
        </div>
        <button className="btn btn--primary btn--block" onClick={complete} disabled={!total}>
          Complete Sale
        </button>
      </aside>
    </div>
  );
}