export default function BarChart({ data, keys = ['value'], colors = ['#FF6B00', '#FF8A3D'] }) {
  const max = Math.max(...data.flatMap((d) => keys.map((k) => d[k])))
  return (
    <div className="flex h-48 items-end gap-3">
      {data.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full items-end justify-center gap-1" style={{ height: 160 }}>
            {keys.map((k, ki) => (
              <div
                key={k}
                className="w-full rounded-t-md transition-all"
                style={{ height: `${(d[k] / max) * 100}%`, background: colors[ki % colors.length] }}
              />
            ))}
          </div>
          <span className="text-xs text-white/40">{d.name}</span>
        </div>
      ))}
    </div>
  )
}
