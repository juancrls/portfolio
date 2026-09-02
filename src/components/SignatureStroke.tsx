export function SignatureStroke() {
  return (
    <svg
      aria-hidden
      viewBox="0 -10 520 48"
      className="mt-5 h-auto w-[min(28rem,80%)]"
      fill="none"
    >
      <path
        d="M4 26c34-16 56-22 68-18 11 4 6 14-4 18-11 4-16 1-12-6 5-9 24-16 48-18 25-3 44 2 62 8 19 6 38 12 62 11 25-1 47-9 70-16 24-8 46-14 70-12 25 2 45 12 68 16 24 4 50 2 76-8"
        stroke="var(--lime-edge)"
        strokeWidth="3"
        pathLength={700}
        strokeLinecap="round"
        className="ink-stroke"
        style={{ ["--len" as string]: 700 }}
      />
    </svg>
  );
}
