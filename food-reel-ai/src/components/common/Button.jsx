import clsx from 'clsx'

const variants = {
  primary: 'bg-gradient-to-r from-[#FF7A00] to-[#FFB07A] text-black shadow-[0_20px_50px_rgba(255,122,0,0.25)] hover:brightness-105',
  outline: 'border border-white/10 bg-white/5 text-white hover:bg-white/10',
  ghost: 'text-white/70 hover:text-white hover:bg-white/10',
  danger: 'bg-red-500/10 text-red-300 border border-red-500/20 hover:bg-red-500/20',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-3 text-sm',
  lg: 'px-6 py-3.5 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  icon: Icon,
  full,
  ...props
}) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        full && 'w-full',
        className
      )}
      {...props}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  )
}
