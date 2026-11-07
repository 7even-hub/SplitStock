import { useState } from 'react';
import { Wallet, Truck, PackageCheck, Plus, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { PageHead, Badge } from '../components/ui';
import { naira } from '../data';
import './Purchases.scss';

const PAGE_SIZE = 3;

// Starting rows (replace with your API data later)
const seed = [
  { id: 1, date: 'Oct 24, 2023', product: 'Premium Parboiled Rice', qty: '50 Bags', cost: 1750000, supplier: 'Dangote Distributors Ltd.', status: 'Delivered' },
  { id: 2, date: 'Oct 23, 2023', product: 'Vegetable Oil (25L)', qty: '20 Jerrycans', cost: 640000, supplier: 'Kings Oil Supply', status: 'Pending' },
  { id: 3, date: 'Oct 21, 2023', product: 'Evaporated Milk (Tins)', qty: '15 Cartons', cost: 225000, supplier: 'FrieslandCampina', status: 'Delivered' },
  { id: 4, date: 'Oct 19, 2023', product: 'Indomie Noodles (Carton)', qty: '40 Cartons', cost: 520000, supplier: 'Dufil Prima Foods', status: 'Delivered' },
  { id: 5, date: 'Oct 17, 2023', product: 'Peak Milk Tin 400g', qty: '30 Cartons', cost: 810000, supplier: 'FrieslandCampina', status: 'Pending' },
];
const emptyForm = { product: '', qty: '', unit: 'Bags', cost: '', supplier: '', status: 'Pending' };

export default function Purchases() {
  const [rows, setRows] = useState(seed);
  const [q, setQ] = useState('');              // search text
  const [status, setStatus] = useState('All'); // status filter
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);     // is the Add Purchase popup open?
  const [form, setForm] = useState(emptyForm);

  // 1) filter by search + status, 2) cut out the current page
  const filtered = rows.filter((r) =>
    (status === 'All' || r.status === status) &&
    (r.product + r.supplier).toLowerCase().includes(q.toLowerCase()));
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const start = (current - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  // Summary cards are worked out from the rows, so they update when you add a purchase
  const totalSpend = rows.reduce((s, r) => s + r.cost, 0);
  const suppliers = [...new Set(rows.map((r) => r.supplier))];
  const pending = rows.filter((r) => r.status === 'Pending').length;

  // Returns an onChange handler that updates one field of the form
  const field = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  // Add the new purchase to the top of the list
  const save = (e) => {
    e.preventDefault();
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    setRows([{ id: Date.now(), date, product: form.product, qty: `${form.qty} ${form.unit}`, cost: Number(form.cost), supplier: form.supplier, status: form.status }, ...rows]);
    setForm(emptyForm); setOpen(false); setPage(1);
  };

  return (
    <>
      <PageHead title="Purchases Management" sub="Track and manage your incoming stock and supplier orders.">
        <button className="btn btn--primary" onClick={() => setOpen(true)}><Plus size={16} /> Add Purchase</button>
      </PageHead>

      {/* Three summary cards */}
      <section className="grid grid--3">
        <div className="card stat">
          <div className="stat__top"><span className="pico pico--blue"><Wallet size={16} /></span><span className="pill">This Month</span></div>
          <span className="muted">Total Spend</span>
          <strong>{naira(totalSpend)}</strong>
          <small>+12% from last month</small>
        </div>
        <div className="card stat">
          <div className="stat__top"><span className="pico pico--blue"><Truck size={16} /></span></div>
          <span className="muted">Active Suppliers</span>
          <strong>{suppliers.length}</strong>
          <div className="avatars">
            {suppliers.slice(0, 2).map((s) => <i key={s}>{s[0]}</i>)}
            {suppliers.length > 2 && <i>+{suppliers.length - 2}</i>}
          </div>
        </div>
        <div className="card stat">
          <div className="stat__top"><span className="pico pico--red"><PackageCheck size={16} /></span></div>
          <span className="muted">Pending Deliveries</span>
          <strong>{pending}</strong>
          <small className="muted">Expecting items today</small>
        </div>
      </section>

      {/* Recent purchases table */}
      <section className="card">
        <div className="card__bar">
          <h2>Recent Purchases</h2>
          <div className="tools">
            <label className="search"><Search size={14} />
              <input placeholder="Search orders..." value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
            </label>
            <select className="btn btn--ghost" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Filter by status">
              <option>All</option><option>Delivered</option><option>Pending</option>
            </select>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Date</th><th>Product</th><th>Qty / Unit</th><th>Total Cost (₦)</th><th>Supplier</th><th>Status</th></tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr key={r.id}>
                  <td>{r.date}</td><td>{r.product}</td><td>{r.qty}</td>
                  <td><b>{r.cost.toLocaleString()}</b></td><td>{r.supplier}</td>
                  <td><Badge tone={r.status === 'Delivered' ? 'ok' : 'warn'}>{r.status}</Badge></td>
                </tr>
              ))}
              {visible.length === 0 && <tr><td colSpan="6" className="muted">No purchases match your search.</td></tr>}
            </tbody>
          </table>
        </div>

        {/* Page arrows */}
        <div className="pager">
          <span className="muted">Showing {filtered.length ? start + 1 : 0} to {start + visible.length} of {filtered.length} entries</span>
          <div>
            <button onClick={() => setPage(current - 1)} disabled={current === 1} aria-label="Previous page"><ChevronLeft size={16} /></button>
            <button onClick={() => setPage(current + 1)} disabled={current === pages} aria-label="Next page"><ChevronRight size={16} /></button>
          </div>
        </div>
      </section>

      {/* Add Purchase popup: clicking the dark background closes it */}
      {open && (
        <div className="modal" onClick={() => setOpen(false)}>
          <form className="card modal__box" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <div className="card__bar">
              <h2>Add Purchase</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close"><X size={18} /></button>
            </div>
            <label>Product<input required value={form.product} onChange={field('product')} placeholder="e.g. Premium Parboiled Rice" /></label>
            <div className="modal__row">
              <label>Quantity<input required type="number" min="1" value={form.qty} onChange={field('qty')} /></label>
              <label>Unit
                <select value={form.unit} onChange={field('unit')}>
                  <option>Bags</option><option>Cartons</option><option>Jerrycans</option><option>Crates</option><option>Pieces</option>
                </select>
              </label>
            </div>
            <label>Total cost (₦)<input required type="number" min="0" value={form.cost} onChange={field('cost')} /></label>
            <label>Supplier<input required value={form.supplier} onChange={field('supplier')} /></label>
            <label>Status
              <select value={form.status} onChange={field('status')}><option>Pending</option><option>Delivered</option></select>
            </label>
            <button className="btn btn--primary btn--block">Save purchase</button>
          </form>
        </div>
      )}
    </>
  );
}
