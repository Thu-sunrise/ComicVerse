import { useState, useEffect } from "react"
import {
  User, Comic, Interactions,
  getComics, addComic, deleteComic, getAllInteractions, logout,
} from "../store"

interface Props {
  user: User
  onLogout: () => void
}

type Tab = "comics" | "stats"

const DEFAULT_PAGES = [
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=1100&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=1100&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=1100&fit=crop&auto=format",
]

const BLANK_FORM = { title: "", author: "", description: "", genre: "", cover: "" }

export default function AdminPage({ user, onLogout }: Props) {
  const [tab, setTab] = useState<Tab>("comics")
  const [comics, setComics] = useState<Comic[]>([])
  const [interactions, setInteractions] = useState<Record<string, Interactions>>({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [form, setForm] = useState(BLANK_FORM)
  const [formError, setFormError] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  function refresh() {
    setComics(getComics())
    setInteractions(getAllInteractions())
  }

  useEffect(() => { refresh() }, [])

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setFormError("")
    if (!form.title.trim() || !form.author.trim() || !form.description.trim() || !form.genre.trim()) {
      setFormError("Title, author, genre, and description are required.")
      return
    }
    addComic({
      title: form.title.trim(),
      author: form.author.trim(),
      description: form.description.trim(),
      genre: form.genre.trim(),
      cover: form.cover.trim() || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=560&fit=crop&auto=format",
      chapters: [{ id: "ch1", title: "Chapter 1", pages: DEFAULT_PAGES }],
    })
    setForm(BLANK_FORM)
    setShowAddForm(false)
    refresh()
  }

  function handleDelete(id: string) {
    if (deleteConfirm === id) {
      deleteComic(id)
      setDeleteConfirm(null)
      refresh()
    } else {
      setDeleteConfirm(id)
    }
  }

  const totalViews = Object.values(interactions).reduce((s, i) => s + i.views, 0)
  const totalLikes = Object.values(interactions).reduce((s, i) => s + i.likes.length, 0)
  const totalDislikes = Object.values(interactions).reduce((s, i) => s + i.dislikes.length, 0)
  const totalComments = Object.values(interactions).reduce((s, i) => s + i.comments.length, 0)

  const recentComments = comics
    .flatMap((comic) =>
      (interactions[comic.id]?.comments ?? []).map((c) => ({ ...c, comicTitle: comic.title }))
    )
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 12)

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Header */}
      <header className="bg-surface border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-3xl tracking-widest text-primary" style={{ letterSpacing: "0.12em" }}>
            COMICVERSER
          </h1>
          <span className="bg-accent text-bg text-xs font-mono font-bold px-2 py-0.5 rounded-md">
            ADMIN
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-muted text-sm font-mono">@{user.username}</span>
          <button
            onClick={() => { logout(); onLogout() }}
            className="text-sm text-muted hover:text-danger transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Comics", value: comics.length, color: "text-accent" },
            { label: "Total Views", value: totalViews.toLocaleString(), color: "text-primary" },
            { label: "Total Likes", value: totalLikes, color: "text-success" },
            { label: "Total Comments", value: totalComments, color: "text-text" },
          ].map((s) => (
            <div key={s.label} className="bg-surface border border-border rounded-2xl p-5">
              <div className={`text-3xl font-bold font-mono ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted uppercase tracking-widest mt-1.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-surface border border-border rounded-xl p-1 mb-6 w-fit">
          {(["comics", "stats"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors ${
                tab === t ? "bg-primary text-white" : "text-muted hover:text-text"
              }`}
            >
              {t === "comics" ? "Manage Comics" : "Statistics"}
            </button>
          ))}
        </div>

        {/* Comics tab */}
        {tab === "comics" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg">Comics Library ({comics.length})</h2>
              <button
                onClick={() => { setShowAddForm(!showAddForm); setFormError("") }}
                className="bg-primary hover:bg-primary-dark text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
              >
                {showAddForm ? "✕ Cancel" : "+ Add Comic"}
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleAdd} className="bg-surface border border-border rounded-2xl p-6 mb-6">
                <h3 className="font-bold text-accent mb-4 text-sm uppercase tracking-widest">New Comic</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-muted uppercase tracking-widest mb-1.5">Title *</label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Comic title"
                      className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-text placeholder:text-muted focus:outline-none focus:border-primary text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted uppercase tracking-widest mb-1.5">Author *</label>
                    <input
                      value={form.author}
                      onChange={(e) => setForm({ ...form, author: e.target.value })}
                      placeholder="Author name"
                      className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-text placeholder:text-muted focus:outline-none focus:border-primary text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted uppercase tracking-widest mb-1.5">Genre *</label>
                    <input
                      value={form.genre}
                      onChange={(e) => setForm({ ...form, genre: e.target.value })}
                      placeholder="e.g. Sci-Fi / Action"
                      className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-text placeholder:text-muted focus:outline-none focus:border-primary text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted uppercase tracking-widest mb-1.5">Cover Image URL</label>
                    <input
                      value={form.cover}
                      onChange={(e) => setForm({ ...form, cover: e.target.value })}
                      placeholder="https://... (optional)"
                      className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-text placeholder:text-muted focus:outline-none focus:border-primary text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-muted uppercase tracking-widest mb-1.5">Description *</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={2}
                      placeholder="Brief description of the comic..."
                      className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-text placeholder:text-muted focus:outline-none focus:border-primary text-sm resize-none"
                    />
                  </div>
                </div>
                {formError && (
                  <p className="text-danger text-sm mt-3">{formError}</p>
                )}
                <button type="submit" className="mt-4 bg-primary hover:bg-primary-dark text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm">
                  Add Comic
                </button>
              </form>
            )}

            <div className="space-y-3">
              {comics.map((comic) => {
                const inter = interactions[comic.id] ?? { views: 0, likes: [], dislikes: [], comments: [] }
                return (
                  <div
                    key={comic.id}
                    className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-4 hover:border-border/60 transition-colors"
                  >
                    <img
                      src={comic.cover}
                      alt={comic.title}
                      className="w-12 h-16 object-cover rounded-xl flex-shrink-0 bg-surface2"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold truncate">{comic.title}</div>
                      <div className="text-muted text-xs mt-0.5">{comic.author} · {comic.genre}</div>
                      <div className="flex gap-4 mt-2 text-xs font-mono text-muted">
                        <span className="text-text/70">👁 {inter.views.toLocaleString()}</span>
                        <span className="text-success">❤ {inter.likes.length}</span>
                        <span className="text-danger">👎 {inter.dislikes.length}</span>
                        <span>💬 {inter.comments.length}</span>
                        <span>📖 {comic.chapters.length} ch</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(comic.id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                        deleteConfirm === comic.id
                          ? "bg-danger text-white"
                          : "text-muted hover:text-danger hover:bg-bg"
                      }`}
                    >
                      {deleteConfirm === comic.id ? "Confirm?" : "Delete"}
                    </button>
                    {deleteConfirm === comic.id && (
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="text-xs text-muted hover:text-text px-2 py-1.5 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                )
              })}

              {comics.length === 0 && (
                <div className="text-center py-16 text-muted">
                  <div className="text-4xl mb-3">📭</div>
                  <div>No comics yet. Add one above.</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats tab */}
        {tab === "stats" && (
          <div className="space-y-6">
            {/* Overview cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Views", value: totalViews.toLocaleString(), sub: "across all comics" },
                { label: "Total Likes", value: totalLikes, sub: `${totalDislikes} dislikes` },
                { label: "Approval Rate", value: (totalLikes + totalDislikes > 0 ? Math.round((totalLikes / (totalLikes + totalDislikes)) * 100) : 0) + "%", sub: "likes vs dislikes" },
                { label: "Feedback", value: totalComments, sub: "total comments" },
              ].map((s) => (
                <div key={s.label} className="bg-surface border border-border rounded-2xl p-5 text-center">
                  <div className="text-3xl font-bold font-mono text-accent">{s.value}</div>
                  <div className="text-xs text-muted uppercase tracking-widest mt-1">{s.label}</div>
                  <div className="text-xs text-muted/60 mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Per-comic stats table */}
            <div>
              <h3 className="font-bold mb-3 text-sm uppercase tracking-widest text-muted">Per-Comic Breakdown</h3>
              <div className="bg-surface border border-border rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["Comic", "Views", "Likes", "Dislikes", "Comments", "Approval"].map((h) => (
                        <th
                          key={h}
                          className={`px-4 py-3 text-xs font-mono text-muted uppercase tracking-widest ${h === "Comic" ? "text-left" : "text-right"}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comics
                      .map((comic) => ({ comic, inter: interactions[comic.id] ?? { views: 0, likes: [], dislikes: [], comments: [] } }))
                      .sort((a, b) => b.inter.views - a.inter.views)
                      .map(({ comic, inter }, idx) => {
                        const totalVotes = inter.likes.length + inter.dislikes.length
                        const approval = totalVotes > 0 ? Math.round((inter.likes.length / totalVotes) * 100) : null
                        return (
                          <tr key={comic.id} className={`border-b border-border last:border-0 ${idx % 2 !== 0 ? "bg-bg/20" : ""}`}>
                            <td className="px-4 py-3">
                              <div className="font-semibold">{comic.title}</div>
                              <div className="text-xs text-muted">{comic.author}</div>
                            </td>
                            <td className="px-4 py-3 text-right font-mono">{inter.views.toLocaleString()}</td>
                            <td className="px-4 py-3 text-right font-mono text-success">{inter.likes.length}</td>
                            <td className="px-4 py-3 text-right font-mono text-danger">{inter.dislikes.length}</td>
                            <td className="px-4 py-3 text-right font-mono">{inter.comments.length}</td>
                            <td className="px-4 py-3 text-right">
                              <span
                                className={`font-mono font-bold ${
                                  approval === null ? "text-muted" : approval >= 70 ? "text-success" : approval >= 40 ? "text-accent" : "text-danger"
                                }`}
                              >
                                {approval !== null ? `${approval}%` : "—"}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent comments */}
            {recentComments.length > 0 && (
              <div>
                <h3 className="font-bold mb-3 text-sm uppercase tracking-widest text-muted">Recent Feedback</h3>
                <div className="space-y-2">
                  {recentComments.map((c) => (
                    <div key={c.id} className="bg-surface border border-border rounded-xl px-4 py-3 flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                        {c.username[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-muted mb-0.5">
                          <span className="text-accent font-semibold">{c.username}</span>
                          {" on "}
                          <span className="text-text/80">{c.comicTitle}</span>
                          {" · "}
                          <span>{new Date(c.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-text/90 truncate">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
