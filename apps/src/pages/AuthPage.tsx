import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { getApps, initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { login, register, requestPasswordReset, resetPassword, saveExternalUser, User } from "../store"

type Mode = "login" | "register" | "forgot" | "reset"
type FormValues = { username: string; email: string; password: string; confirmPassword: string }

const schemas = {
  login: z.object({ username: z.string().min(1, "Username is required"), password: z.string().min(1, "Password is required") }),
  register: z.object({ username: z.string().min(3, "Use at least 3 characters"), email: z.string().email("Enter a valid email"), password: z.string().min(6, "Use at least 6 characters"), confirmPassword: z.string() }).refine((data) => data.password === data.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match" }),
  forgot: z.object({ email: z.string().email("Enter a valid email") }),
  reset: z.object({ username: z.string().min(1, "Username is required"), password: z.string().min(6, "Use at least 6 characters"), confirmPassword: z.string() }).refine((data) => data.password === data.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match" }),
}

interface Props { onAuth: (user: User) => void }

function firebaseAuth() {
  const config = { apiKey: import.meta.env.VITE_FIREBASE_API_KEY, authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID }
  if (!config.apiKey || !config.authDomain || !config.projectId) return null
  const app = getApps()[0] ?? initializeApp(config)
  return getAuth(app)
}

export default function AuthPage({ onAuth }: Props) {
  const [mode, setMode] = useState<Mode>("login")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const { register: field, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schemas[mode]), defaultValues: { username: "", email: "", password: "", confirmPassword: "" } })

  function switchMode(next: Mode) { setMode(next); setMessage(""); setError(""); reset() }

  async function submit(values: FormValues) {
    setError(""); setMessage("")
    if (mode === "login") { const user = login(values.username.trim(), values.password); if (!user) return setError("Invalid username or password."); onAuth(user) }
    if (mode === "register") { const user = register(values.username.trim(), values.password, values.email.trim()); if (!user) return setError("Username already taken. Try another."); onAuth(user) }
    if (mode === "forgot") { requestPasswordReset(values.email.trim()); setMessage("If an account matches, reset instructions are ready."); setMode("reset") }
    if (mode === "reset") { if (!resetPassword(values.username.trim(), values.password)) return setError("We could not find that username."); setMessage("Password updated. You can sign in now."); setMode("login") }
  }

  async function googleLogin() {
    setError("")
    const auth = firebaseAuth()
    if (!auth) return setError("Google Login needs VITE_FIREBASE_API_KEY, AUTH_DOMAIN, and PROJECT_ID.")
    try { const result = await signInWithPopup(auth, new GoogleAuthProvider()); onAuth(saveExternalUser({ id: result.user.uid, username: result.user.displayName || result.user.email?.split("@")[0] || "reader", password: "", email: result.user.email || "", displayName: result.user.displayName || "", avatar: result.user.photoURL || "", role: "user" })) }
    catch { setError("Google sign-in was cancelled or unavailable.") }
  }

  const title = mode === "login" ? "Welcome back" : mode === "register" ? "Join the verse" : mode === "forgot" ? "Find your way back" : "Set a new password"
  const submitLabel = mode === "login" ? "Sign In" : mode === "register" ? "Create Account" : mode === "forgot" ? "Send Reset Link" : "Reset Password"
  const input = (name: keyof FormValues, label: string, type = "text", placeholder = "") => <label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted">{label}</span><input {...field(name)} type={type} placeholder={placeholder} autoComplete={type === "password" ? "new-password" : name} className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-text placeholder:text-muted focus:border-primary focus:outline-none" />{errors[name] && <span className="mt-1 block text-xs text-danger">{errors[name]?.message}</span>}</label>

  return <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg p-4"><div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" /><div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-accent/5 blur-3xl" /><div className="relative z-10 w-full max-w-md"><div className="mb-8 text-center"><h1 className="font-display text-6xl tracking-widest text-primary">COMICVERSE</h1><p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted">Your universe of comics</p></div><section className="rounded-2xl border border-border bg-surface p-7 shadow-2xl sm:p-9"><div className="mb-7"><p className="font-mono text-xs uppercase tracking-widest text-primary">Account access</p><h2 className="mt-2 text-2xl font-extrabold">{title}</h2></div>{(mode === "login" || mode === "register") && <div className="mb-6 flex gap-1 rounded-xl bg-bg p-1"><button type="button" onClick={() => switchMode("login")} className={`flex-1 rounded-lg py-2.5 text-sm font-bold ${mode === "login" ? "bg-primary text-white" : "text-muted"}`}>Sign In</button><button type="button" onClick={() => switchMode("register")} className={`flex-1 rounded-lg py-2.5 text-sm font-bold ${mode === "register" ? "bg-primary text-white" : "text-muted"}`}>Register</button></div>}<form onSubmit={handleSubmit(submit)} className="space-y-4">{(mode === "login" || mode === "register" || mode === "reset") && input("username", "Username", "text", "your handle")}{mode === "register" && input("email", "Email", "email", "you@example.com")}{(mode === "login" || mode === "register" || mode === "reset") && input("password", "Password", "password", "••••••••")}{(mode === "register" || mode === "reset") && input("confirmPassword", "Confirm password", "password", "••••••••")}{mode === "forgot" && input("email", "Email", "email", "you@example.com")}{error && <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>}{message && <div className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">{message}</div>}<button disabled={isSubmitting} className="mt-2 w-full rounded-xl bg-primary py-3 font-bold tracking-wide text-white transition hover:bg-primary-dark disabled:opacity-60">{isSubmitting ? "Working..." : submitLabel}</button></form>{mode === "login" && <><button type="button" onClick={googleLogin} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-bg py-3 text-sm font-bold text-text transition hover:border-primary"><span className="text-lg">G</span> Continue with Google</button><button type="button" onClick={() => switchMode("forgot")} className="mt-5 w-full text-center text-xs font-bold text-muted hover:text-primary">Forgot password?</button><div className="mt-6 border-t border-border pt-4 text-center font-mono text-[11px] text-muted">Demo: reader1 / pass123</div></>}{mode !== "login" && <button type="button" onClick={() => switchMode("login")} className="mt-5 w-full text-center text-xs font-bold text-muted hover:text-primary">Back to sign in</button>}</section></div></main>
}
