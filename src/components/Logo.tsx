export function Logo(props: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className="flex items-center space-x-2" {...props}>
    
      <span className="text-xl font-bold text-zinc-900 dark:text-white">
        Magic Lab
      </span>
    </div>
  )
}
