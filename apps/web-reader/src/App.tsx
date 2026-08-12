import React, { useEffect, useState } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
}

interface Story {
  id: number;
  title: string;
  description: string;
  status: string;
}

interface ReadingProgress {
  id: number;
  userId: number;
  storyId: number;
  chapterId: number;
  progressPercent: number;
}

const AUTH_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8081';
const STORY_URL = import.meta.env.VITE_STORY_API_URL || 'http://localhost:8082';
const SYNC_URL = import.meta.env.VITE_SYNC_API_URL || 'http://localhost:8083';

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [userError, setUserError] = useState<string | null>(null);
  const [userLoading, setUserLoading] = useState<boolean>(true);

  const [stories, setStories] = useState<Story[]>([]);
  const [storyError, setStoryError] = useState<string | null>(null);
  const [storyLoading, setStoryLoading] = useState<boolean>(true);

  const [progresses, setProgresses] = useState<ReadingProgress[]>([]);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncLoading, setSyncLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch Users
    fetch(`${AUTH_URL}/api/v1/users`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setUserLoading(false);
      })
      .catch((err) => {
        setUserError(err.message || 'Failed to fetch users');
        setUserLoading(false);
      });

    // Fetch Stories
    fetch(`${STORY_URL}/api/v1/stories`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setStories(data);
        setStoryLoading(false);
      })
      .catch((err) => {
        setStoryError(err.message || 'Failed to fetch stories');
        setStoryLoading(false);
      });

    // Fetch Reading Progress
    fetch(`${SYNC_URL}/api/v1/reading-progress`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProgresses(data);
        setSyncLoading(false);
      })
      .catch((err) => {
        setSyncError(err.message || 'Failed to fetch reading progress');
        setSyncLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1>ComicVerse Microservices POC</h1>
        <p>Proof of Concept Architecture — Independent DB & Failure Isolation Verification</p>
      </header>

      <div className="grid">
        {/* Section 1: Users */}
        <div className="card">
          <div className="card-title">
            <span>[ Users ]</span>
            {userLoading ? (
              <span className="badge badge-loading">Loading...</span>
            ) : userError ? (
              <span className="badge badge-error">Service Down</span>
            ) : (
              <span className="badge badge-success">Online (8081)</span>
            )}
          </div>
          {userError ? (
            <div className="error-box">Error: {userError}</div>
          ) : (
            <ul className="item-list">
              {users.map((u) => (
                <li key={u.id} className="item">
                  <div className="item-header">{u.id}. {u.username}</div>
                  <div className="item-sub">{u.email}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Section 2: Stories */}
        <div className="card">
          <div className="card-title">
            <span>[ Stories ]</span>
            {storyLoading ? (
              <span className="badge badge-loading">Loading...</span>
            ) : storyError ? (
              <span className="badge badge-error">Service Down</span>
            ) : (
              <span className="badge badge-success">Online (8082)</span>
            )}
          </div>
          {storyError ? (
            <div className="error-box">Error: {storyError}</div>
          ) : (
            <ul className="item-list">
              {stories.map((s) => (
                <li key={s.id} className="item">
                  <div className="item-header">{s.id}. {s.title}</div>
                  <div className="item-sub">{s.description} • <strong>{s.status}</strong></div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Section 3: Reading Progress */}
        <div className="card">
          <div className="card-title">
            <span>[ Reading Progress ]</span>
            {syncLoading ? (
              <span className="badge badge-loading">Loading...</span>
            ) : syncError ? (
              <span className="badge badge-error">Service Down</span>
            ) : (
              <span className="badge badge-success">Online (8083)</span>
            )}
          </div>
          {syncError ? (
            <div className="error-box">Error: {syncError}</div>
          ) : (
            <ul className="item-list">
              {progresses.map((p) => (
                <li key={p.id} className="item">
                  <div className="item-header">User #{p.userId} — Story #{p.storyId}</div>
                  <div className="item-sub">Chapter #{p.chapterId} • Progress: {p.progressPercent}%</div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${p.progressPercent}%` }}></div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
