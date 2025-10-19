export function Logo(props: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className="flex items-center space-x-2" {...props}>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-sm">
        M
      </div>
      <span className="text-xl font-bold text-zinc-900 dark:text-white">
        Magic Lab
      </span>
    </div>
  )
}
