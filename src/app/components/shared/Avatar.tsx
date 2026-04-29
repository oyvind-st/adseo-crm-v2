import { HTMLAttributes } from 'react'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type AvatarColor = 'blue' | 'violet' | 'green' | 'orange' | 'slate'

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  name: string
  size?: AvatarSize
  color?: AvatarColor
  imageUrl?: string
  shape?: 'circle' | 'rounded'
}

const sizes: Record<AvatarSize, { container: string; text: string }> = {
  xs:  { container: 'w-6 h-6',   text: 'text-xs' },
  sm:  { container: 'w-8 h-8',   text: 'text-xs' },
  md:  { container: 'w-10 h-10', text: 'text-sm' },
  lg:  { container: 'w-12 h-12', text: 'text-base' },
  xl:  { container: 'w-16 h-16', text: 'text-xl' },
}

const colors: Record<AvatarColor, string> = {
  blue:   'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  violet: 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300',
  green:  'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
  slate:  'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase()
}

// Consistent color based on name
function getColorFromName(name: string): AvatarColor {
  const c: AvatarColor[] = ['blue', 'violet', 'green', 'orange', 'slate']
  const idx = name.split('').reduce((s, c) => s + c.charCodeAt(0), 0) % c.length
  return c[idx]
}

export function Avatar({
  name,
  size = 'md',
  color,
  imageUrl,
  shape = 'circle',
  className = '',
  ...props
}: AvatarProps) {
  const resolvedColor = color || getColorFromName(name)
  const { container, text } = sizes[size]
  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-lg'

  return (
    <div
      className={`
        ${container} ${shapeClass} flex items-center justify-center flex-shrink-0
        ${imageUrl ? '' : colors[resolvedColor]}
        ${text} font-semibold
        ${className}
      `}
      title={name}
      {...props}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={name} className={`w-full h-full object-cover ${shapeClass}`} />
      ) : (
        getInitials(name)
      )}
    </div>
  )
}
