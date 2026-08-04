import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";
import { getLocale, t } from "@/lib/i18n";
import { displayHandle } from "@/lib/handle";
import { Avatar } from "./Avatar";
import { FarcasterSignInButton } from "./FarcasterSignInButton";

/**
 * Nav'daki oturum göstergesi. Giriş yapılmışsa hesabı ve profil linkini,
 * yapılmamışsa giriş butonunu gösterir — kullanıcının hangi X hesabıyla
 * bağlı olduğunu görebilmesi için.
 */
export async function AuthControl() {
  const [session, locale] = await Promise.all([auth(), getLocale()]);
  const s = t(locale).nav;
  const username = session?.user?.username;

  if (!username) {
    return (
      <div className="flex items-center gap-1.5">
        <form
          action={async () => {
            "use server";
            await signIn("twitter");
          }}
        >
          <button
            type="submit"
            className="btn-metallic-ghost rounded-full px-3 py-1.5 font-mono text-[10px] tracking-[0.1em]"
          >
            {s.signIn}
          </button>
        </form>
        <FarcasterSignInButton />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <Link
        href={`/u/${encodeURIComponent(username)}`}
        title={s.myProfile}
        className="flex items-center gap-1.5 rounded-full border border-[rgba(var(--edge-rgb),0.18)] bg-carbon/40 py-0.5 pl-0.5 pr-2.5 transition hover:border-[rgba(var(--edge-rgb),0.4)]"
      >
        <span className="h-6 w-6 shrink-0 overflow-hidden rounded-full">
          <Avatar
            imageUrl={session.user?.image ?? null}
            username={username}
            className="h-full w-full object-cover"
            fallback={
              <span className="flex h-full w-full items-center justify-center bg-steel-plate text-[10px] text-ash">
                {displayHandle(username).charAt(0).toUpperCase()}
              </span>
            }
          />
        </span>
        <span className="max-w-[90px] truncate font-mono text-[10px] text-bone">
          @{displayHandle(username)}
        </span>
      </Link>

      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button
          type="submit"
          title={s.signOut}
          className="flex h-7 w-7 items-center justify-center rounded-full text-smoke transition hover:text-bone"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18.75 15L21.75 12m0 0l-3-3m3 3H9"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}
