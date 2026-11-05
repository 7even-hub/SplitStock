import { useState } from 'react';
import { Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageHead, Badge } from '../components/ui';
import { naira } from '../data';
import './Inventory.scss';

const PAGE_SIZE = 3;
const filters = ['All Products', 'Low Stock', 'Bulk', 'Repacked'];

// Sample stock (replace with your API data later)
// kind = whether the item is sold as bulk stock or repacked into smaller units
const seed = [
  { sku: 'RICE-50KG-001', name: 'Premium Parboiled Rice', cat: 'Grains', bulk: '12 Bags', retail: '45 Dericas', price: 1200, status: 'In Stock', kind: 'Repacked' },
  { sku: 'OIL-25L-089', name: 'Vegetable Oil (Kings)', cat: 'Cooking Essentials', bulk: '1 Carton', retail: '2 Bottles', price: 8500, status: 'Low Stock', kind: 'Bulk' },
  { sku: 'EGG-CRT-042', name: 'Large Brown Eggs', cat: 'Dairy & Eggs', bulk: '5 Crates', retail: '120 Pieces', price: 150, status: 'In Stock', kind: 'Bulk' },
  { sku: 'NDL-CTN-011', name: 'Indomie Noodles (Carton)', cat: 'Groceries', bulk: '8 Cartons', retail: '96 Packs', price: 150, status: 'In Stock', kind: 'Repacked' },
  { sku: 'MLK-400-007', name: 'Peak Milk Tin 400g', cat: 'Dairy & Provisions', bulk: '2 Cartons', retail: '6 Tins', price: 1850, status: 'Low Stock', kind: 'Bulk' },
  { sku: 'PST-500-021', name: 'Golden Penny Pasta', cat: 'Groceries', bulk: '6 Cartons', retail: '70 Packs', price: 700, status: 'In Stock', kind: 'Repacked' },
  { sku: 'GNO-SCH-033', name: 'Gino Tomato Paste (Sachet)', cat: 'Cooking Essentials', bulk: '3 Cartons', retail: '4 Sachets', price: 100, status: 'Low Stock', kind: 'Bulk' },
];

export default function Inventory() {
  const [filter, setFilter] = useState('All Products');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);

  // Apply the chip filter and the search box, then cut out the current page
  const rows = seed.filter((r) => {
    const matchesChip =
      filter === 'All Products' ||
      (filter === 'Low Stock' ? r.status === 'Low Stock' : r.kind === filter);
    const matchesSearch = (r.name + r.sku).toLowerCase().includes(q.toLowerCase());
    return matchesChip && matchesSearch;
  });
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const start = (current - 1) * PAGE_SIZE;
  const visible = rows.slice(start, start + PAGE_SIZE);

  return (
    <>
      <PageHead title="Inventory">
        <div className="tools">
          <label className="search">
            <Search size={14} />
            <input placeholder="Search products, SKUs..." value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
          </label>
          <button className="btn btn--primary"><Plus size={16} /> Add New Product</button>
        </div>
      </PageHead>

      <div className="chips">
        {filters.map((f) => (
          <button key={f} className={`chip ${filter === f ? 'is-active' : ''}`} onClick={() => { setFilter(f); setPage(1); }}>
            {f}
          </button>
        ))}
      </div>

      <section className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product Name &amp; SKU</th><th>Category</th><th>Bulk Remaining</th>
                <th>Retail Units</th><th>Selling Price</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr key={r.sku}>
                  <td>
                    <b>{r.name}</b>
                    <small className="sku">SKU: {r.sku}</small>
                  </td>
                  <td className="muted">{r.cat}</td>
                  <td>{r.bulk}</td>
                  <td className={r.status === 'Low Stock' ? 'danger' : ''}>{r.retail}</td>
                  <td><b className="blue">{naira(r.price)}</b></td>
                  <td><Badge tone={r.status === 'In Stock' ? 'ok' : 'warn'}>{r.status}</Badge></td>
                  <td><button className="link">Edit</button></td>
                </tr>
              ))}
              {visible.length === 0 && <tr><td colSpan="7" className="muted">No products match.</td></tr>}
            </tbody>
          </table>
        </div>

        {/* Numbered page buttons */}
        <div className="pages">
          <span className="muted">
            Showing {rows.length ? start + 1 : 0} to {start + visible.length} of {rows.length} entries
          </span>
          <div>
            <button onClick={() => setPage(current - 1)} disabled={current === 1} aria-label="Previous page"><ChevronLeft size={16} /></button>
            {Array.from({ length: pages }, (_, i) => (
              <button key={i} className={current === i + 1 ? 'is-active' : ''} onClick={() => setPage(i + 1)}>{i + 1}</button>
            ))}
            <button onClick={() => setPage(current + 1)} disabled={current === pages} aria-label="Next page"><ChevronRight size={16} /></button>
          </div>
        </div>
      </section>
    </>
  );
}