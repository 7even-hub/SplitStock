import { useState } from "react";
import "./SalesChart.scss";

// Draws a simple bar chart from an array of {label, value} points.
// No charting library needed — just draws one <rect> per data point.
export default function SalesChart({ data, width = 600, height = 220 }) {
  const [hoverIndex, setHoverIndex] = useState(data.length - 1); // last bar highlighted by default

  const padding = { top: 30, right: 10, bottom: 24, left: 34 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map((d) => d.value)) * 1.15; // headroom above the tallest bar

  // Each bar gets an equal slot; barWidth leaves a gap between bars.
  const slotWidth = chartW / data.length;
  const barWidth = slotWidth * 0.55;

  const barFor = (d, i) => {
    const barHeight = (d.value / maxValue) * chartH;
    const x = padding.left + i * slotWidth + (slotWidth - barWidth) / 2;
    const y = padding.top + chartH - barHeight;
    return { x, y, width: barWidth, height: barHeight };
  };

  const bars = data.map(barFor);

  // A handful of horizontal gridlines with y-axis labels (0, 10k, 20k...)
  const gridSteps = 5;
  const gridValues = Array.from({ length: gridSteps + 1 }, (_, i) => (maxValue / gridSteps) * i);

  const formatNaira = (n) => (n >= 1000 ? `${Math.round(n / 1000)}k` : Math.round(n));

  const active = bars[hoverIndex];

  return (
    <svg
      className="sales-chart"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="Sales over the last 7 days"
    >
      {/* Gridlines */}
      {gridValues.map((v, i) => {
        const y = padding.top + chartH - (v / maxValue) * chartH;
        return (
          <g key={i}>
            <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} className="sales-chart__grid" />
            <text x={0} y={y + 4} className="sales-chart__axis-label">
              {formatNaira(v)}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {bars.map((bar, i) => (
        <g key={i} onMouseEnter={() => setHoverIndex(i)}>
          {/* invisible full-height hit area, easier to hover/tap than the bar itself */}
          <rect
            x={padding.left + i * slotWidth}
            y={padding.top}
            width={slotWidth}
            height={chartH}
            fill="transparent"
          />
          <rect
            x={bar.x}
            y={bar.y}
            width={bar.width}
            height={bar.height}
            rx={4}
            className={`sales-chart__bar${i === hoverIndex ? " sales-chart__bar--active" : ""}`}
          />
          <text
            x={bar.x + bar.width / 2}
            y={height - 4}
            className="sales-chart__axis-label sales-chart__axis-label--x"
          >
            {data[i].label}
          </text>
        </g>
      ))}

      {/* Tooltip above the hovered/active bar */}
      {active && (
        <g transform={`translate(${active.x + active.width / 2}, ${active.y})`}>
          <rect x={-34} y={-26} width={68} height={22} rx={5} className="sales-chart__tooltip" />
          <text x={0} y={-11} textAnchor="middle" className="sales-chart__tooltip-text">
            ₦{data[hoverIndex].value.toLocaleString()}
          </text>
        </g>
      )}
    </svg>
  );
}