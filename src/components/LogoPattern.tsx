interface LogoPatternProps {
  logoUrl: string | null;
  opacity?: number;
  tileSize?: number;
}

export function LogoPattern({ logoUrl, opacity = 0.07, tileSize = 72 }: LogoPatternProps) {
  if (!logoUrl) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0"
      style={{
        backgroundImage: `url(${logoUrl})`,
        backgroundRepeat: "repeat",
        backgroundSize: `${tileSize}px ${tileSize}px`,
        opacity,
      }}
    />
  );
}
