import clsx from 'clsx'
import { forwardRef } from 'react'

const Input = forwardRef(function Input(
  { label, error, icon: Icon, className, ...props },
  ref
) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-xs font-medium text-white/60">{label}</span>}
      <div className="relative">
        {Icon && <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />}
        <input
          ref={ref}
          className={clsx(
            'w-full rounded-2xl bg-[#111111] border border-border px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-primary',
            Icon && 'pl-11',
            error && 'border-red-500/60',
            className
          )}
          {...props}
        />
      </div>
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  )
})

export default Input
