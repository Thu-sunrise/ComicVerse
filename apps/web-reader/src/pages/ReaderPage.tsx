import { useState, useEffect, useRef } from "react"
import {
  User, Comic, Chapter, Interactions,
  getComics, getInteractions, getProgress, saveProgress,
  toggleLike, toggleDislike, addComment,
} from "../store"

interface Props {
  user: User
  comicId: string
  initialChapterId: string
  onBack: () => void
}

export default function ReaderPage({ user, comicId, initialChapterId, onBack }: Props) {
  const [comic, setComic] = useState<Comic | null>(null)
  const [chapterId, setChapterId] = useState(initialChapterId)
  const [pageIndex, setPageIndex] = useState(0)
  const [interactions, setInteractions] = useState<Interactions>({ views: 0, likes: [], dislikes: [], comments: [] })
  const [commentText, setCommentText] = useState("")
  const [showSidebar, setShowSidebar] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const topRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const comics = getComics()
    const found = comics.find((c) => c.id === comicId) ?? null
    setComic(found)
    setInteractions(getInteractions(comicId))

    const progress = getProgress(user.id, comicId)
    if (progress) {
      setChapterId(progress.chapterId)
      setPageIndex(progress.pageIndex)
    }
  }, [comicId, user.id])

  const chapter: Chapter | undefined = comic?.chapters.find((ch) => ch.id === chapterId)
  const pages = chapter?.pages ?? []
  const totalPages = pages.length

  function goToPage(idx: number) {
    const clamped = Math.max(0, Math.min(idx, totalPages - 1))
    setPageIndex(clamped)
    setImageLoaded(false)
    saveProgress(user.id, comicId, chapterId, clamped)
    topRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  function changeChapter(newChapterId: string) {
    setChapterId(newChapterId)
    setPageIndex(0)
    setImageLoaded(false)
    saveProgress(user.id, comicId, newChapterId, 0)
    setShowSidebar(false)
    topRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  function handlePrev() {
    if (!comic) return
    if (pageIndex > 0) {
      goToPage(pageIndex - 1)
    } else {
      const idx = comic.chapters.findIndex((ch) => ch.id === chapterId)
      if (idx > 0) changeChapter(comic.chapters[idx - 1].id)
    }
  }

  function handleNext() {
    if (!comic) return
    if (pageIndex < totalPages - 1) {
      goToPage(pageIndex + 1)
    } else {
      const idx = comic.chapters.findIndex((ch) => ch.id === chapterId)
      if (idx < comic.chapters.length - 1) changeChapter(comic.chapters[idx + 1].id)
    }
  }

  const isFirst = pageIndex === 0 && comic?.chapters[0]?.id === chapterId
  const isLast = pageIndex === totalPages - 1 && comic && comic.chapters[comic.chapters.length - 1]?.id === chapterId

  function handleLike() { setInteractions(toggleLike(comicId, user.id)) }
  function handleDislike() { setInteractions(toggleDislike(comicId, user.id)) }

  function handleComment(e: React.FormEvent) {
    e.preventDefault()
    if (!commentText.trim()) return
    setInteractions(addComment(comicId, user.id, user.username, commentText.trim()))
    setCommentText("")
  }

  const hasLiked = interactions.likes.includes(user.id)
  const hasDisliked = interactions.dislikes.includes(user.id)

  if (!comic || !chapter) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center text-muted">
        Loading...
      </div>
    )
  }

  const chapterIndex = comic.chapters.findIndex((ch) => ch.id === chapterId)

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col" ref={topRef}>
      {/* Top bar */}
      <header className="bg-surface border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="text-muted hover:text-text transition-colors text-sm flex-shrink-0 flex items-center gap-1"
          >
            ← Back
          </button>
          <span className="text-border flex-shrink-0">|</span>
          <div className="min-w-0">
            <span className="font-bold text-sm truncate block">{comic.title}</span>
            <span className="text-muted text-xs">{chapter.title}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-muted text-xs font-mono hidden sm:block">
            {pageIndex + 1} / {totalPages}
          </span>
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-xs bg-surface2 hover:bg-border px-3 py-1.5 rounded-lg transition-colors"
          >
            💬 {interactions.comments.length}
          </button>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="text-xs bg-surface2 hover:bg-border px-3 py-1.5 rounded-lg transition-colors"
          >
            {showSidebar ? "✕" : "☰"} Chapters
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Chapter sidebar */}
        {showSidebar && (
          <aside className="w-64 bg-surface border-r border-border flex-shrink-0 overflow-y-auto">
            <div className="p-4">
              <div className="relative aspect-[2/3] mb-4 rounded-xl overflow-hidden bg-surface2">
                <img src={comic.cover} alt={comic.title} className="w-full h-full object-cover" />
              </div>
              <h2 className="font-bold text-sm mb-0.5">{comic.title}</h2>
              <p className="text-muted text-xs mb-1">{comic.author}</p>
              <p className="text-xs text-muted/60 mb-4 leading-relaxed">{comic.description}</p>

              <p className="text-xs text-muted uppercase tracking-widest font-mono mb-2">Chapters</p>
              <div className="space-y-1">
                {comic.chapters.map((ch, i) => (
                  <button
                    key={ch.id}
                    onClick={() => changeChapter(ch.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-colors ${
                      ch.id === chapterId
                        ? "bg-primary text-white font-bold"
                        : "hover:bg-surface2 text-muted hover:text-text"
                    }`}
                  >
                    <span className="font-mono text-muted mr-1.5">{String(i + 1).padStart(2, "0")}</span>
                    {ch.title}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* Reader + comments */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 py-6">
            {/* Chapter indicator */}
            <div className="flex items-center justify-between mb-4 text-xs font-mono text-muted">
              <span>Chapter {chapterIndex + 1} of {comic.chapters.length}</span>
              <span>{pageIndex + 1} / {totalPages}</span>
            </div>

            {/* Page image */}
            <div className="relative bg-surface2 rounded-2xl overflow-hidden shadow-2xl">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <img
                key={`${chapterId}-${pageIndex}`}
                src={pages[pageIndex]}
                alt={`Page ${pageIndex + 1}`}
                onLoad={() => setImageLoaded(true)}
                className={`w-full object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                style={{ filter: "contrast(1.08) saturate(0.88)" }}
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-5 gap-3">
              <button
                onClick={handlePrev}
                disabled={!!isFirst}
                className="flex-1 py-3 bg-surface border border-border rounded-xl text-sm font-bold disabled:opacity-25 hover:border-primary transition-colors"
              >
                ← {pageIndex === 0 ? "Prev Chapter" : "Prev Page"}
              </button>

              {/* Page dots */}
              <div className="flex gap-1.5 flex-shrink-0">
                {Array.from({ length: Math.min(totalPages, 9) }).map((_, i) => {
                  const actualIdx = totalPages <= 9 ? i : Math.round((i / 8) * (totalPages - 1))
                  return (
                    <button
                      key={i}
                      onClick={() => goToPage(actualIdx)}
                      className={`rounded-full transition-all ${
                        actualIdx === pageIndex
                          ? "w-3 h-3 bg-primary"
                          : "w-2 h-2 bg-border hover:bg-muted"
                      }`}
                    />
                  )
                })}
              </div>

              <button
                onClick={handleNext}
                disabled={!!isLast}
                className="flex-1 py-3 bg-surface border border-border rounded-xl text-sm font-bold disabled:opacity-25 hover:border-primary transition-colors"
              >
                {pageIndex === totalPages - 1 ? "Next Chapter" : "Next Page"} →
              </button>
            </div>

            {/* Like / dislike / views */}
            <div className="flex items-center gap-3 mt-6 pt-5 border-t border-border">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                  hasLiked
                    ? "bg-primary border-primary text-white"
                    : "border-border text-muted hover:border-primary hover:text-primary"
                }`}
              >
                ❤️ <span className="font-mono">{interactions.likes.length}</span>
              </button>
              <button
                onClick={handleDislike}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                  hasDisliked
                    ? "bg-surface2 border-danger text-danger"
                    : "border-border text-muted hover:border-danger hover:text-danger"
                }`}
              >
                👎 <span className="font-mono">{interactions.dislikes.length}</span>
              </button>
              <div className="flex-1" />
              <span className="text-xs text-muted font-mono">👁 {interactions.views.toLocaleString()} views</span>
            </div>

            {/* Comments section */}
            {showComments && (
              <div className="mt-6 border-t border-border pt-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  Comments
                  <span className="text-muted text-sm font-normal font-mono">({interactions.comments.length})</span>
                </h3>

                <form onSubmit={handleComment} className="flex gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-xs font-bold text-white">
                    {user.username[0].toUpperCase()}
                  </div>
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="flex-1 bg-surface border border-border rounded-xl px-4 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-dark text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors flex-shrink-0"
                  >
                    Post
                  </button>
                </form>

                <div className="space-y-4">
                  {[...interactions.comments].reverse().map((c) => (
                    <div key={c.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface2 border border-border flex-shrink-0 flex items-center justify-center text-xs font-bold">
                        {c.username[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-accent">{c.username}</span>
                          <span className="text-xs text-muted">
                            {new Date(c.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                          </span>
                        </div>
                        <p className="text-sm text-text/90 leading-relaxed">{c.text}</p>
                      </div>
                    </div>
                  ))}

                  {interactions.comments.length === 0 && (
                    <p className="text-muted text-sm text-center py-4">No comments yet. Be the first!</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
