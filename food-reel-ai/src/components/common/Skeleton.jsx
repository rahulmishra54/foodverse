import clsx from 'clsx'

export default function Skeleton({ className }) {
  return <div className={clsx('skeleton rounded-2xl', className)} />
}
