import { useState, useEffect } from "react"
import { User, getCurrentUser, initStore } from "./store"
import AuthPage from "./pages/AuthPage"
import AdminPage from "./pages/AdminPage"
// import UserPage from "./pages/UserPage"
// import ReaderPage from "./pages/ReaderPage"

type View = "auth" | "home" | "admin"

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
    if (u?.role === "admin") {
      setUser(u)
      setView("admin")
    }
  }, [])

  function handleAuth(u: User) {
    setUser(u)
    setView("admin")
  }

  function handleLogout() {
    setUser(null)
    setView("auth")
    setReaderCtx(null)
  }

  // function handleRead(comicId: string, chapterId: string) {
  //   setReaderCtx({ comicId, chapterId })
  //   setView("reader")
  // }

  if (!user || view === "auth") {
    return <AuthPage onAuth={handleAuth} />
  }

  if (view === "admin" && user.role === "admin") {
    return <AdminPage user={user} onLogout={handleLogout} />
  }

  // if (view === "reader" && readerCtx) {
  //   return (
  //     <ReaderPage
  //       user={user}
  //       comicId={readerCtx.comicId}
  //       initialChapterId={readerCtx.chapterId}
  //       onBack={() => setView("home")}
  //     />
  //   )
  // }

  // return <UserPage user={user} onLogout={handleLogout} onRead={handleRead} />
}
