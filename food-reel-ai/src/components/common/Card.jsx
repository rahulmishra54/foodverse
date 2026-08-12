import clsx from 'clsx'

export default function Card({ children, className, hover, ...props }) {
  return (
    <div
      className={clsx(
        'glass-card rounded-[28px] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.35)]',
        hover && 'transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_32px_90px_rgba(255,122,0,0.15)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
