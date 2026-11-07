import { useState } from 'react';
import { Download } from 'lucide-react';
import { PageHead, Stat } from '../components/ui';
import { topMakers, naira } from '../data';
import './Reports-Profits.scss';

// Numbers for each period (replace with your API data later)
// Bar heights are percentages of the chart height
const periods = {
  'This Month (Oct 2023)': {
    sales: 1245000, cogs: 820000, expenses: 145500,
    salesNote: '+12.5% vs last month', expensesNote: '+5.2% (fuel costs)',
    weeks: [
      { w: 'W1', sales: 45, profit: 20 }, { w: 'W2', sales: 60, profit: 30 },
      { w: 'W3', sales: 75, profit: 40 }, { w: 'W4', sales: 55, profit: 35 },
      { w: 'W5', sales: 80, profit: 50 },
    ],
  },
  'Last Month (Sep 2023)': {
    sales: 1106000, cogs: 748000, expenses: 138300,
    salesNote: '+6.4% vs previous month', expensesNote: '+2.1% (fuel costs)',
    weeks: [
      { w: 'W1', sales: 40, profit: 16 }, { w: 'W2', sales: 52, profit: 24 },
      { w: 'W3', sales: 58, profit: 28 }, { w: 'W4', sales: 66, profit: 34 },
      { w: 'W5', sales: 50, profit: 26 },
    ],
  },
};

export default function Reports() {
  const [period, setPeriod] = useState('This Month (Oct 2023)');
  const p = periods[period];

  // Profit and margin are worked out from the numbers above
  const profit = p.sales - p.cogs - p.expenses;
  const margin = ((profit / p.sales) * 100).toFixed(1);

  // Save the summary as a CSV file the user can open in Excel
  const download = () => {
    const csv = ['Item,Amount (NGN)', `Total Sales,${p.sales}`, `Cost of Goods,${p.cogs}`,
      `Operating Expenses,${p.expenses}`, `Net Profit,${profit}`].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'report.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHead title="Reports & Profit" sub="Overview of financial performance for this month.">
        <div className="tools">
          <select className="btn btn--ghost" value={period} onChange={(e) => setPeriod(e.target.value)} aria-label="Report period">
            {Object.keys(periods).map((k) => <option key={k}>{k}</option>)}
          </select>
          <button className="btn btn--ghost" onClick={download} aria-label="Download report"><Download size={16} /></button>
        </div>
      </PageHead>

      {/* Four summary cards */}
      <section className="grid grid--4">
        <Stat label="Total Sales" value={naira(p.sales)} note={p.salesNote} />
        <Stat label="Cost of Goods" value={naira(p.cogs)} note="Consistent with sales vol." />
        <Stat label="Op. Expenses" value={naira(p.expenses)} note={p.expensesNote} />
        <Stat hero label="Est. Net Profit" value={naira(profit)} note={`${margin}% Margin`} />
      </section>

      <div className="grid grid--report">
        {/* Bar chart: two bars (sales, profit) for each week */}
        <section className="card">
          <div className="card__bar">
            <h2>Sales vs Profit (30 Days)</h2>
            <span className="legend"><i /> Sales <i className="dark" /> Profit</span>
          </div>
          <div className="chart">
            {p.weeks.map((w) => (
              <div key={w.w} className="chart__group">
                <div className="chart__bars">
                  <span style={{ height: `${w.sales}%` }} />
                  <span className="dark" style={{ height: `${w.profit}%` }} />
                </div>
                <small>{w.w}</small>
              </div>
            ))}
          </div>
        </section>

        {/* Ranked list of the most profitable products */}
        <section className="card">
          <div className="card__bar">
            <h2>Top Profit Makers</h2>
            <a href="#all">View All</a>
          </div>
          <ol className="tops">
            {topMakers.map((t, i) => (
              <li key={t.name}>
                <span className="tops__n">{i + 1}</span>
                <div>
                  <b>{t.name}</b>
                  <small className="muted block">{t.cat}</small>
                </div>
                <b>{naira(t.profit)}</b>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </>
  );
}