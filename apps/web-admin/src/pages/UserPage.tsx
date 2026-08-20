import { useState, useEffect } from "react"
import {
  User, Comic, Interactions, ReadingProgress,
  getComics, getAllInteractions, getProgress, logout, incrementViews,
} from "../store"

interface Props {
  user: User
  onLogout: () => void
  onRead: (comicId: string, chapterId: string) => void
}

export default function UserPage({ user, onLogout, onRead }: Props) {
  const [comics, setComics] = useState<Comic[]>([])
  const [interactions, setInteractions] = useState<Record<string, Interactions>>({})
  const [progresses, setProgresses] = useState<Record<string, ReadingProgress | null>>({})
  const [search, setSearch] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("All")

  useEffect(() => {
    const c = getComics()
    const i = getAllInteractions()
    setComics(c)
    setInteractions(i)
    const p: Record<string, ReadingProgress | null> = {}
    c.forEach((comic) => { p[comic.id] = getProgress(user.id, comic.id) })
    setProgresses(p)
  }, [user.id])

  const genres = ["All", ...Array.from(new Set(comics.map((c) => c.genre.split(" / ")[0])))]

  const filtered = comics.filter((c) => {
    const q = search.toLowerCase()
    const matchSearch = !q || c.title.toLowerCase().includes(q) || c.author.toLowerCase().includes(q)
    const matchGenre = selectedGenre === "All" || c.genre.includes(selectedGenre)
    return matchSearch && matchGenre
  })

  const inProgress = comics.filter((c) => progresses[c.id] != null)

  function handleRead(comic: Comic, chapterIdOverride?: string) {
    const progress = progresses[comic.id]
    const chapterId = chapterIdOverride ?? progress?.chapterId ?? comic.chapters[0]?.id
    if (!chapterId) return
    incrementViews(comic.id)
    onRead(comic.id, chapterId)
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Header */}
      <header className="bg-surface border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <h1
          className="font-display text-3xl text-primary"
          style={{ letterSpacing: "0.12em" }}
        >
          COMICVERSE
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-muted text-sm font-mono hidden sm:block">@{user.username}</span>
          <button
            onClick={() => { logout(); onLogout() }}
            className="text-sm text-muted hover:text-danger transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">

        {/* Continue reading rail */}
        {inProgress.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xs text-muted uppercase tracking-widest font-mono mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
              Continue Reading
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1">
              {inProgress.map((comic) => {
                const p = progresses[comic.id]!
                const chapter = comic.chapters.find((ch) => ch.id === p.chapterId)
                const progress = chapter ? Math.round(((p.pageIndex + 1) / chapter.pages.length) * 100) : 0
                return (
                  <div
                    key={comic.id}
                    onClick={() => handleRead(comic)}
                    className="flex-shrink-0 w-52 bg-surface border border-primary/20 hover:border-primary/60 rounded-2xl overflow-hidden cursor-pointer transition-colors group"
                  >
                    <div className="relative h-32 overflow-hidden bg-surface2">
                      <img
                        src={comic.cover}
                        alt={comic.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
                      <div className="absolute bottom-2 left-3 right-3">
                        <div className="text-xs text-primary font-bold font-mono">▶ Continue</div>
                        <div className="text-xs text-muted truncate">{chapter?.title} · pg {p.pageIndex + 1}</div>
                      </div>
                    </div>
                    <div className="px-3 pt-2 pb-3">
                      <div className="text-sm font-bold truncate mb-1.5">{comic.title}</div>
                      <div className="h-1 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted mt-1 font-mono">{progress}%</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Search + genre filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-sm">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search comics or authors..."
              className="w-full bg-surface border border-border rounded-xl pl-9 pr-4 py-3 text-text placeholder:text-muted focus:outline-none focus:border-primary transition-colors text-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                  selectedGenre === g
                    ? "bg-primary text-white"
                    : "bg-surface border border-border text-muted hover:text-text hover:border-border/80"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Section heading */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs text-muted uppercase tracking-widest font-mono flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-muted inline-block" />
            {selectedGenre === "All" ? "All Comics" : selectedGenre}
            <span className="text-muted/50">({filtered.length})</span>
          </h2>
        </div>

        {/* Comics grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
          {filtered.map((comic) => {
            const inter = interactions[comic.id] ?? { views: 0, likes: [], dislikes: [], comments: [] }
            const hasProgress = progresses[comic.id] != null
            return (
              <div
                key={comic.id}
                className="group cursor-pointer"
                onClick={() => handleRead(comic)}
              >
                <div className="relative rounded-2xl overflow-hidden mb-3 bg-surface2 aspect-[2/3]">
                  <img
                    src={comic.cover}
                    alt={comic.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent" />
                  {hasProgress && (
                    <div className="absolute top-2 right-2 bg-primary text-white text-xs font-mono font-bold px-1.5 py-0.5 rounded-md">
                      In Progress
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">{comic.description}</p>
                  </div>
                  <div className="absolute bottom-2 left-3 flex gap-2 text-xs font-mono text-white/70 group-hover:opacity-0 transition-opacity">
                    <span>👁 {inter.views.toLocaleString()}</span>
                    <span>❤ {inter.likes.length}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-snug truncate">{comic.title}</h3>
                  <p className="text-muted text-xs mt-0.5">{comic.author}</p>
                  <p className="text-muted/50 text-xs">{comic.genre}</p>
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24 text-muted">
            <div className="text-5xl mb-4">📭</div>
            <div className="font-semibold">No comics found</div>
            <div className="text-sm mt-1">Try a different search or genre</div>
          </div>
        )}
      </div>
    </div>
  )
}
