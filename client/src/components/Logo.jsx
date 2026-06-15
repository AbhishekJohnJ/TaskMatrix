const Logo = ({ size = 32, className = '' }) => {
  return (
    <div className="relative inline-block">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Grid dots and connections */}
        {/* Top row */}
        <circle cx="20" cy="20" r="8" fill="#EF4444" />
        <line x1="28" y1="20" x2="42" y2="20" stroke="#EF4444" strokeWidth="4" />
        <circle cx="50" cy="20" r="8" fill="#F87171" />
        <line x1="58" y1="20" x2="72" y2="20" stroke="#F87171" strokeWidth="4" />
        <circle cx="80" cy="20" r="8" fill="#FCA5A5" />

        {/* Middle row */}
        <circle cx="20" cy="50" r="8" fill="#EF4444" />
        <line x1="28" y1="50" x2="42" y2="50" stroke="#EF4444" strokeWidth="4" />
        <circle cx="50" cy="50" r="8" fill="#F87171" />
        <line x1="58" y1="50" x2="72" y2="50" stroke="#FCA5A5" strokeWidth="4" />
        <circle cx="80" cy="50" r="8" fill="#FCA5A5" />

        {/* Bottom row */}
        <circle cx="20" cy="80" r="8" fill="#EF4444" />
        <line x1="28" y1="80" x2="42" y2="80" stroke="#EF4444" strokeWidth="4" />
        <circle cx="50" cy="80" r="8" fill="#F87171" />
        <line x1="58" y1="80" x2="72" y2="80" stroke="#F87171" strokeWidth="4" />
        <circle cx="80" cy="80" r="8" fill="#FCA5A5" />

        {/* Vertical connections */}
        <line x1="20" y1="28" x2="20" y2="42" stroke="#EF4444" strokeWidth="4" />
        <line x1="20" y1="58" x2="20" y2="72" stroke="#EF4444" strokeWidth="4" />
        <line x1="50" y1="28" x2="50" y2="42" stroke="#F87171" strokeWidth="4" />
        <line x1="50" y1="58" x2="50" y2="72" stroke="#F87171" strokeWidth="4" />
        <line x1="80" y1="28" x2="80" y2="42" stroke="#FCA5A5" strokeWidth="4" />
        <line x1="80" y1="58" x2="80" y2="72" stroke="#FCA5A5" strokeWidth="4" />

        {/* Check mark */}
        <path
          d="M 35 50 L 45 65 L 70 30"
          stroke="#EF4444"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
};

export default Logo;
