import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { loginAdmin } from "@/server/admin";

export const Route = createFileRoute("/admin-login")({
  head: () => ({
    meta: [
      { title: "Admin Login — Net Phantom Store" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const router = useRouter();
  const login = useServerFn(loginAdmin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login({ data: { email, password } });
      if (!result.ok) {
        setError(result.error);
        return;
      }

      await router.navigate({ to: "/admin" });
    } catch {
      setError("Unable to sign in right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
          ← Back to store
        </Link>

        <div className="card-glow mt-8 rounded-2xl p-7 sm:p-9">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-primary">Private area</div>
          <h1 className="mt-2 font-display text-3xl font-black">Admin sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage orders, products, inventory and store operations.
          </p>

          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-semibold">Email</span>
              <input
                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-3 outline-none transition focus:border-primary"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold">Password</span>
              <div className="relative mt-2">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-3 outline-none transition focus:border-primary"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
            </label>

            {error ? (
              <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-3 text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}

            <button
              className="w-full rounded-lg bg-primary px-4 py-3 font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
