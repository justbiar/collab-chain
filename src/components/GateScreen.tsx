/**
 * Shared shell for the short "you can't go further" screens — expired invites,
 * locked genesis, wrong account. Keeps them on the same plate as the real pages
 * instead of dropping to a bare background.
 */
export function GateScreen({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-blueprint-grid relative flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden px-4 py-28">
      <div aria-hidden className="ambient-blue-aura" />
      <div aria-hidden className="ambient-blueprint-aura" />

      <div className="metallic-panel relative z-10 flex w-full max-w-md flex-col items-center gap-4 rounded-[22px] px-8 py-10 text-center">
        {children}
      </div>
    </div>
  );
}
