// Minimal className utility — joins truthy strings
export function clsx(...args) {
  return args
    .flatMap(a => (Array.isArray(a) ? a : [a]))
    .filter(Boolean)
    .join(' ');
}
