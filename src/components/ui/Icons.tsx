import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }
const base = (size = 18): SVGProps<SVGSVGElement> => ({
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5,
  strokeLinecap: 'square', strokeLinejoin: 'miter', 'aria-hidden': true, focusable: false,
})

export const ArrowRight = ({ size, ...p }: P) => <svg {...base(size)} {...p}><path d="M4 12h15M13 6l6 6-6 6" /></svg>
export const ArrowLeft = ({ size, ...p }: P) => <svg {...base(size)} {...p}><path d="M20 12H5M11 6l-6 6 6 6" /></svg>
export const ArrowUp = ({ size, ...p }: P) => <svg {...base(size)} {...p}><path d="M12 20V5M6 11l6-6 6 6" /></svg>
export const ArrowDown = ({ size, ...p }: P) => <svg {...base(size)} {...p}><path d="M12 4v15M6 13l6 6 6-6" /></svg>
export const ArrowUpRight = ({ size, ...p }: P) => <svg {...base(size)} {...p}><path d="M7 17 17 7M8 7h9v9" /></svg>
export const Search = ({ size, ...p }: P) => <svg {...base(size)} {...p}><circle cx="11" cy="11" r="6.5" /><path d="m16 16 5 5" /></svg>
export const Plus = ({ size, ...p }: P) => <svg {...base(size)} {...p}><path d="M12 5v14M5 12h14" /></svg>
export const Minus = ({ size, ...p }: P) => <svg {...base(size)} {...p}><path d="M5 12h14" /></svg>
export const Close = ({ size, ...p }: P) => <svg {...base(size)} {...p}><path d="m5 5 14 14M19 5 5 19" /></svg>
export const Menu = ({ size, ...p }: P) => <svg {...base(size)} {...p}><path d="M3 7h18M3 12h18M3 17h18" /></svg>
export const Chevron = ({ size, ...p }: P) => <svg {...base(size)} {...p}><path d="m6 9 6 6 6-6" /></svg>
export const Check = ({ size, ...p }: P) => <svg {...base(size)} {...p}><path d="m4 12.5 5 5L20 6.5" /></svg>
export const Cross = ({ size, ...p }: P) => <svg {...base(size)} {...p}><path d="m6 6 12 12M18 6 6 18" /></svg>
export const Reset = ({ size, ...p }: P) => <svg {...base(size)} {...p}><path d="M4 12a8 8 0 1 0 3-6.2M4 4v5h5" /></svg>
export const Expand = ({ size, ...p }: P) => <svg {...base(size)} {...p}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
export const Bookmark = ({ size, filled, ...p }: P & { filled?: boolean }) => (
  <svg {...base(size)} {...p} fill={filled ? 'currentColor' : 'none'}><path d="M6 3.5h12v17l-6-4.5-6 4.5z" /></svg>
)
export const Grip = ({ size, ...p }: P) => <svg {...base(size)} {...p}><path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01" strokeWidth="3" strokeLinecap="round" /></svg>
