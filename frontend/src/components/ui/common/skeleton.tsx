import { cn } from "@/utils/tw-merge"
import { HTMLAttributes } from 'react'

function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-lg dark:bg-muted bg-card", className)}
      {...props}
    />
  )
}

export { Skeleton }
