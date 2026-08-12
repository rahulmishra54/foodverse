import clsx from 'clsx'

const styles = {
  default: 'bg-white/10 text-white/80',
  primary: 'bg-primary/15 text-primary',
  success: 'bg-emerald-500/15 text-emerald-400',
  warning: 'bg-yellow-500/15 text-yellow-400',
  danger: 'bg-red-500/15 text-red-400',
}

export default function Badge({ children, variant = 'default', className }) {
  return (
    <span className={clsx('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium', styles[variant], className)}>
      {children}
    </span>
  )
}
