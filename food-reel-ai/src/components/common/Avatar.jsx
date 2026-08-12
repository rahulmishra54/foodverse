import clsx from 'clsx'
import { BadgeCheck } from 'lucide-react'

export default function Avatar({ src, size = 40, verified, ring, className }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <img
        src={src}
        alt=""
        className={clsx(
          'h-full w-full rounded-full object-cover shadow-[0_12px_40px_rgba(0,0,0,0.35)]',
          ring && 'ring-2 ring-[#FF7A00]/40 ring-offset-2 ring-offset-[#050505]',
          className
        )}
      />
      {verified && (
        <BadgeCheck size={size * 0.42} className="absolute -bottom-1 -right-1 rounded-full bg-[#050505] text-[#FF7A00] shadow-lg" fill="currentColor" />
      )}
    </div>
  )
}
