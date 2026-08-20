import { useState } from "react"
import { login, User } from "../store"

interface Props {
  onAuth: (user: User) => void
}

export default function AuthPage({ onAuth }: Props) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields.")
      return
    }
    const user = login(username.trim(), password)
    if (!user) {
      setError("Only the admin account can sign in.")
      return
    }
    onAuth(user)
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,92,26,0.08) 0%, transparent 70%)" }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1
            className="font-display text-7xl tracking-widest text-primary"
            style={{ letterSpacing: "0.15em" }}
          >
            COMICVERSE
          </h1>
          <p className="text-muted text-xs mt-2 font-mono tracking-widest uppercase">
            Your universe of comics
          </p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {error && (
              <div className="bg-danger/10 border border-danger/30 rounded-xl px-4 py-2.5 text-danger text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-colors mt-2 text-sm tracking-wide"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 bg-bg rounded-xl px-4 py-3 border border-border">
            <p className="text-xs text-muted font-mono text-center mb-1">Admin credentials</p>
            <div className="text-center text-xs font-mono">
              <span className="text-accent">admin / admin123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
