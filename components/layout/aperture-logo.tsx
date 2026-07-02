export function ApertureLogo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="13" r="10" stroke="#2563eb" strokeWidth="1.5" />
      <circle cx="13" cy="13" r="5.5" stroke="#2563eb" strokeWidth="1.5" />
      <circle cx="13" cy="13" r="1.8" fill="#2563eb" />
      <line x1="13" y1="3" x2="13" y2="7.5" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="13" y1="18.5" x2="13" y2="23" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="3" y1="13" x2="7.5" y2="13" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="18.5" y1="13" x2="23" y2="13" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
