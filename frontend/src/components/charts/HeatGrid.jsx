export default function HeatGrid({ data }) {
  return (
    <div className="heat-grid">
      {data.map((item) => {
        const intensity = Math.min(1, item.traffic / 100);
        const background = `rgba(14, 165, 154, ${0.2 + intensity * 0.7})`;
        return (
          <div key={item.slot} className="heat-cell" style={{ background }}>
            <span>{item.slot}</span>
            <strong>{item.traffic}</strong>
          </div>
        );
      })}
    </div>
  );
}
