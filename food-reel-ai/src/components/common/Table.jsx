export default function Table({ columns, data, renderRow }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-white/[0.02] text-white/50">
            {columns.map((col) => (
              <th key={col} className="whitespace-nowrap px-4 py-3 font-medium">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id || i} className="border-b border-border/60 last:border-0 hover:bg-white/[0.02]">
              {renderRow(row)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
