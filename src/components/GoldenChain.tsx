interface GoldenChainProps {
  linkCount?: number;
  className?: string;
  animated?: boolean;
  /** Kopmuş halka — elenmiş bir üyeye giden bağ. */
  broken?: boolean;
}

export function GoldenChain({
  linkCount = 9,
  className = "",
  animated = true,
  broken = false,
}: GoldenChainProps) {
  return (
    <div aria-hidden className={`flex flex-1 items-center justify-center ${className}`}>
      <div className="flex items-center">
        {Array.from({ length: linkCount }).map((_, i) => (
          <div
            key={i}
            style={animated && !broken ? { animationDelay: `${i * 0.25}s` } : undefined}
            className={[
              "h-9 w-6 shrink-0 rounded-full border-[3px] bg-transparent",
              broken ? "chain-link-broken" : "chain-link-gold",
              animated && !broken ? "chain-pulse-active" : "",
              i % 2 === 0 ? "rotate-0" : "rotate-90",
              i !== 0 ? "-ml-3" : "",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}
