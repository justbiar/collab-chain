interface GoldenChainProps {
  linkCount?: number;
  className?: string;
}

export function GoldenChain({ linkCount = 9, className = "" }: GoldenChainProps) {
  return (
    <div
      aria-hidden
      className={`flex flex-1 items-center justify-center ${className}`}
    >
      <div className="flex items-center">
        {Array.from({ length: linkCount }).map((_, i) => (
          <div
            key={i}
            className={[
              "h-9 w-6 shrink-0 rounded-full border-[3px] border-bone/30 bg-transparent",
              i % 2 === 0 ? "rotate-0" : "rotate-90",
              i !== 0 ? "-ml-3" : "",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}
