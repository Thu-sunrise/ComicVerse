import { useState, useEffect } from "react"
import { User, getCurrentUser, initStore } from "./store"
import AuthPage from "./pages/AuthPage"
import AdminPage from "./pages/AdminPage"
import UserPage from "./pages/UserPage"
import ReaderPage from "./pages/ReaderPage"
import ProfilePage from "./pages/ProfilePage"

type View = "auth" | "home" | "admin" | "reader" | "profile"

interface ReaderCtx {
  comicId: string
  chapterId: string
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [view, setView] = useState<View>("auth")
  const [readerCtx, setReaderCtx] = useState<ReaderCtx | null>(null)

  useEffect(() => {
    initStore()
    const u = getCurrentUser()
    if (u) {
      setUser(u)
      setView(u.role === "admin" ? "admin" : "home")
    }
  }, [])

  function handleAuth(u: User) {
    setUser(u)
    setView(u.role === "admin" ? "admin" : "home")
  }

  function handleLogout() {
    setUser(null)
    setView("auth")
    setReaderCtx(null)
  }

  function handleProfileUpdated(updated: User) {
    setUser(updated)
    setView(updated.role === "admin" ? "admin" : "home")
  }

  function handleRead(comicId: string, chapterId: string) {
    setReaderCtx({ comicId, chapterId })
    setView("reader")
  }

  if (!user || view === "auth") {
    return <AuthPage onAuth={handleAuth} />
  }

  if (view === "admin" && user.role === "admin") {
    return <AdminPage user={user} onLogout={handleLogout} onProfile={() => setView("profile")} />
  }

  if (view === "reader" && readerCtx) {
    return (
      <ReaderPage
        user={user}
        comicId={readerCtx.comicId}
        initialChapterId={readerCtx.chapterId}
        onBack={() => setView("home")}
      />
    )
  }

  if (view === "profile") {
    return <ProfilePage user={user} onUpdated={handleProfileUpdated} onBack={() => setView(user.role === "admin" ? "admin" : "home")} />
  }

  return <UserPage user={user} onLogout={handleLogout} onRead={handleRead} onProfile={() => setView("profile")} />
}
