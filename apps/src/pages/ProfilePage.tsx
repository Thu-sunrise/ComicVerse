import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { User, updateProfile } from "../store"

const profileSchema = z.object({ displayName: z.string().min(2, "Use at least 2 characters"), email: z.string().email("Enter a valid email") })
type ProfileValues = z.infer<typeof profileSchema>

interface Props { user: User; onUpdated: (user: User) => void; onBack: () => void }

export default function ProfilePage({ user, onUpdated, onBack }: Props) {
  const [avatar, setAvatar] = useState(user.avatar || "")
  const [zoom, setZoom] = useState(1)
  const [toast, setToast] = useState("")
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileValues>({ resolver: zodResolver(profileSchema), defaultValues: { displayName: user.displayName || user.username, email: user.email || "" } })
  const initials = (user.displayName || user.username).slice(0, 2).toUpperCase()

  function chooseAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file || !file.type.startsWith("image/")) return setToast("Please choose an image file.")
    if (file.size > 4 * 1024 * 1024) return setToast("Avatar must be smaller than 4 MB.")
    const reader = new FileReader()
    reader.onload = () => setAvatar(String(reader.result))
    reader.readAsDataURL(file)
  }

  function submit(values: ProfileValues) {
    const updated = updateProfile(user.id, { ...values, avatar })
    if (!updated) return setToast("Could not save your profile.")
    onUpdated(updated)
    setToast("Profile saved successfully.")
    window.setTimeout(() => setToast(""), 2800)
  }

  return <main className="min-h-screen bg-bg text-text"><header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface px-5 py-4 sm:px-8"><button onClick={onBack} className="text-sm font-bold text-muted hover:text-text">← Back to library</button><span className="font-display text-3xl tracking-widest text-primary">COMICVERSE</span><span className="w-24 text-right font-mono text-xs text-muted">PROFILE</span></header><div className="mx-auto grid max-w-5xl gap-6 p-5 sm:p-8 lg:grid-cols-[0.8fr_1.2fr]"><section className="rounded-2xl border border-border bg-surface p-6"><p className="font-mono text-xs uppercase tracking-widest text-primary">Your identity</p><h1 className="mt-2 text-2xl font-extrabold">Profile settings</h1><p className="mt-2 text-sm leading-6 text-muted">Shape how your reader profile appears across the verse.</p><div className="mt-8 flex justify-center"><div className="relative h-44 w-44 overflow-hidden rounded-full border-4 border-primary/40 bg-surface2 shadow-2xl">{avatar ? <img src={avatar} alt="Avatar preview" className="h-full w-full object-cover" style={{ transform: `scale(${zoom})` }} /> : <div className="flex h-full w-full items-center justify-center font-display text-6xl text-primary">{initials}</div>}</div></div><label className="mt-6 block cursor-pointer rounded-xl border border-border bg-bg px-4 py-3 text-center text-sm font-bold hover:border-primary">Upload avatar<input type="file" accept="image/png,image/jpeg,image/webp" onChange={chooseAvatar} className="sr-only" /></label>{avatar && <label className="mt-5 block"><span className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted"><span>Crop zoom</span><span>{zoom.toFixed(1)}x</span></span><input type="range" min="1" max="2" step="0.1" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} className="mt-3 w-full accent-primary" /></label>}</section><section className="rounded-2xl border border-border bg-surface p-6 sm:p-8"><form onSubmit={handleSubmit(submit)} className="space-y-5"><label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted">Display name</span><input {...register("displayName")} className="w-full rounded-xl border border-border bg-bg px-4 py-3 focus:border-primary focus:outline-none" />{errors.displayName && <span className="mt-1 block text-xs text-danger">{errors.displayName.message}</span>}</label><label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted">Email</span><input {...register("email")} type="email" className="w-full rounded-xl border border-border bg-bg px-4 py-3 focus:border-primary focus:outline-none" />{errors.email && <span className="mt-1 block text-xs text-danger">{errors.email.message}</span>}</label><div className="rounded-xl border border-border bg-bg p-4"><p className="text-xs uppercase tracking-widest text-muted">Username</p><p className="mt-1 font-mono text-sm">@{user.username}</p><p className="mt-2 text-xs text-muted">Your username is permanent and cannot be edited here.</p></div><button disabled={isSubmitting} className="w-full rounded-xl bg-primary py-3 font-bold text-white hover:bg-primary-dark disabled:opacity-60">{isSubmitting ? "Saving..." : "Save profile"}</button></form></section></div>{toast && <div className="fixed bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-xl border border-success/40 bg-surface px-5 py-3 text-sm font-bold text-success shadow-xl">{toast}</div>}</main>
}
