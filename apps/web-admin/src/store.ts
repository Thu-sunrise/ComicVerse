export interface User {
  id: string
  username: string
  password: string
  role: "admin" | "user"
}

export interface Comment {
  id: string
  userId: string
  username: string
  text: string
  timestamp: number
}

export interface Chapter {
  id: string
  title: string
  pages: string[]
}

export interface Comic {
  id: string
  title: string
  author: string
  cover: string
  description: string
  genre: string
  chapters: Chapter[]
}

export interface Interactions {
  views: number
  likes: string[]
  dislikes: string[]
  comments: Comment[]
}

export interface ReadingProgress {
  chapterId: string
  pageIndex: number
  updatedAt: number
}

function load<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function save(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

const SCIFI_PAGES = [
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=1100&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=1100&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=1100&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1464802686167-b19c3fa616b5?w=800&h=1100&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&h=1100&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800&h=1100&fit=crop&auto=format",
]

const FANTASY_PAGES = [
  "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800&h=1100&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1501862700950-18382cd41497?w=800&h=1100&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1475070929565-c76b83f246d6?w=800&h=1100&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=800&h=1100&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=1100&fit=crop&auto=format",
]

const CYBERPUNK_PAGES = [
  "https://images.unsplash.com/photo-1545486332-9e0999c535b2?w=800&h=1100&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=1100&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&h=1100&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=1100&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1530435460869-d13625c69bbf?w=800&h=1100&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&h=1100&fit=crop&auto=format",
]

const DARKFANTASY_PAGES = [
  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1100&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=1100&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=1100&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1548248823-ce16a73b6d49?w=800&h=1100&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1499336315816-097655dcfbda?w=800&h=1100&fit=crop&auto=format",
]

const INITIAL_COMICS: Comic[] = [
  {
    id: "c1",
    title: "Shadow Protocol",
    author: "Alex Mercer",
    cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=560&fit=crop&auto=format",
    description: "A covert operative uncovers a deadly conspiracy woven into the fabric of the most powerful tech corporation on Earth. Trust no one. Expose everything.",
    genre: "Sci-Fi",
    chapters: [
      { id: "ch1", title: "Chapter 1: Initiation", pages: SCIFI_PAGES },
      { id: "ch2", title: "Chapter 2: The Breach", pages: [...SCIFI_PAGES].reverse() },
      { id: "ch3", title: "Chapter 3: Zero Hour", pages: SCIFI_PAGES.slice(0, 4) },
    ],
  },
  {
    id: "c2",
    title: "Bloom & Thorn",
    author: "Sera Vance",
    cover: "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=400&h=560&fit=crop&auto=format",
    description: "Two rival mages from warring kingdoms must forge an uneasy alliance when an ancient evil threatens to consume the world entire.",
    genre: "Fantasy",
    chapters: [
      { id: "ch1", title: "Chapter 1: Enemies at Dawn", pages: FANTASY_PAGES },
      { id: "ch2", title: "Chapter 2: The Pact", pages: [...FANTASY_PAGES].reverse() },
    ],
  },
  {
    id: "c3",
    title: "Neon Ghosts",
    author: "Jin Ryo",
    cover: "https://images.unsplash.com/photo-1545486332-9e0999c535b2?w=400&h=560&fit=crop&auto=format",
    description: "In a city where digital ghosts haunt the network, one detective must interface with the dead to solve the city's most brutal murders.",
    genre: "Cyberpunk",
    chapters: [
      { id: "ch1", title: "Chapter 1: Ghost Signal", pages: CYBERPUNK_PAGES },
      { id: "ch2", title: "Chapter 2: Deep Dive", pages: [...CYBERPUNK_PAGES].reverse() },
      { id: "ch3", title: "Chapter 3: Dark Node", pages: CYBERPUNK_PAGES.slice(1) },
    ],
  },
  {
    id: "c4",
    title: "The Iron Covenant",
    author: "Drake Ashford",
    cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=560&fit=crop&auto=format",
    description: "A disgraced knight bound by a blood oath must reclaim a cursed throne before the eternal winter swallows the last realm of men.",
    genre: "Dark Fantasy",
    chapters: [
      { id: "ch1", title: "Chapter 1: Exile", pages: DARKFANTASY_PAGES },
      { id: "ch2", title: "Chapter 2: The Covenant", pages: [...DARKFANTASY_PAGES].reverse() },
    ],
  },
]

const INITIAL_USERS: User[] = [
  { id: "u0", username: "admin", password: "admin123", role: "admin" }
]

const INITIAL_INTERACTIONS: Record<string, Interactions> = {
  c1: {
    views: 1842,
    likes: ["u1"],
    dislikes: [],
    comments: [
      { id: "cm1", userId: "u1", username: "reader1", text: "This storyline hits different. Chapter 2 left me breathless!", timestamp: Date.now() - 86400000 * 2 },
      { id: "cm2", userId: "u0", username: "admin", text: "The pacing in this arc is masterful.", timestamp: Date.now() - 3600000 * 5 },
    ],
  },
  c2: {
    views: 934,
    likes: [],
    dislikes: [],
    comments: [
      { id: "cm3", userId: "u1", username: "reader1", text: "The art style is absolutely gorgeous.", timestamp: Date.now() - 86400000 },
    ],
  },
  c3: {
    views: 2341,
    likes: ["u1"],
    dislikes: [],
    comments: [
      { id: "cm4", userId: "u1", username: "reader1", text: "Best cyberpunk comic I have read all year.", timestamp: Date.now() - 3600000 },
    ],
  },
  c4: { views: 672, likes: [], dislikes: [], comments: [] },
}

export function initStore() {
  if (!load("comicverse_initialized")) {
    save("users", INITIAL_USERS)
    save("comics", INITIAL_COMICS)
    save("interactions", INITIAL_INTERACTIONS)
    save("comicverse_initialized", true)
  }
}

export function getUsers(): User[] {
  return load<User[]>("users") ?? []
}

export function getCurrentUser(): User | null {
  return load<User>("current_user")
}

export function login(username: string, password: string): User | null {
  const user = getUsers().find(
    (u) =>
      u.role === "admin" &&
      u.username === "admin" &&
      u.password === "admin123" &&
      username === "admin" &&
      password === "admin123",
  )
  if (user) save("current_user", user)
  return user ?? null
}

export function register(username: string, password: string): User | null {
  const users = getUsers()
  if (users.find((u) => u.username === username)) return null
  const user: User = { id: `u${Date.now()}`, username, password, role: "user" }
  save("users", [...users, user])
  save("current_user", user)
  return user
}

export function logout() {
  localStorage.removeItem("current_user")
}

export function getComics(): Comic[] {
  return load<Comic[]>("comics") ?? []
}

export function addComic(comic: Omit<Comic, "id">): Comic {
  const comics = getComics()
  const newComic: Comic = { ...comic, id: `c${Date.now()}` }
  save("comics", [...comics, newComic])
  const all = load<Record<string, Interactions>>("interactions") ?? {}
  all[newComic.id] = { views: 0, likes: [], dislikes: [], comments: [] }
  save("interactions", all)
  return newComic
}

export function deleteComic(id: string) {
  save("comics", getComics().filter((c) => c.id !== id))
}

export function getInteractions(comicId: string): Interactions {
  const all = load<Record<string, Interactions>>("interactions") ?? {}
  return all[comicId] ?? { views: 0, likes: [], dislikes: [], comments: [] }
}

export function getAllInteractions(): Record<string, Interactions> {
  return load<Record<string, Interactions>>("interactions") ?? {}
}

function saveInteractions(comicId: string, data: Interactions) {
  const all = load<Record<string, Interactions>>("interactions") ?? {}
  all[comicId] = data
  save("interactions", all)
}

export function incrementViews(comicId: string) {
  const i = getInteractions(comicId)
  saveInteractions(comicId, { ...i, views: i.views + 1 })
}

export function toggleLike(comicId: string, userId: string): Interactions {
  const i = getInteractions(comicId)
  const updated = {
    ...i,
    likes: i.likes.includes(userId) ? i.likes.filter((id) => id !== userId) : [...i.likes, userId],
    dislikes: i.dislikes.filter((id) => id !== userId),
  }
  saveInteractions(comicId, updated)
  return updated
}

export function toggleDislike(comicId: string, userId: string): Interactions {
  const i = getInteractions(comicId)
  const updated = {
    ...i,
    dislikes: i.dislikes.includes(userId) ? i.dislikes.filter((id) => id !== userId) : [...i.dislikes, userId],
    likes: i.likes.filter((id) => id !== userId),
  }
  saveInteractions(comicId, updated)
  return updated
}

export function addComment(comicId: string, userId: string, username: string, text: string): Interactions {
  const i = getInteractions(comicId)
  const comment: Comment = { id: `cm${Date.now()}`, userId, username, text, timestamp: Date.now() }
  const updated = { ...i, comments: [...i.comments, comment] }
  saveInteractions(comicId, updated)
  return updated
}

export function getProgress(userId: string, comicId: string): ReadingProgress | null {
  return load<ReadingProgress>(`prog_${userId}_${comicId}`)
}

export function saveProgress(userId: string, comicId: string, chapterId: string, pageIndex: number) {
  save(`prog_${userId}_${comicId}`, { chapterId, pageIndex, updatedAt: Date.now() })
}
