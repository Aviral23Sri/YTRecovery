'use client'

import { useState } from 'react'
import styles from './DashboardAccordion.module.css'

interface Lesson {
  id:               string
  title:            string
  youtube_video_id: string | null
  position:         number
  duration_minutes: number | null
}

interface Module {
  id:       string
  title:    string
  position: number
  lessons:  Lesson[]
}

interface DashboardAccordionProps {
  modules: Module[]
}

export default function DashboardAccordion({ modules }: DashboardAccordionProps) {
  const [openModule, setOpenModule]   = useState<string | null>(modules[0]?.id ?? null)
  const [activeLesson, setActiveLesson] = useState<string | null>(
    modules[0]?.lessons[0]?.id ?? null
  )

  const currentLesson = modules
    .flatMap((m) => m.lessons)
    .find((l) => l.id === activeLesson)

  return (
    <div className={styles.root}>
      {/* Left — module / lesson nav */}
      <nav className={styles.nav} aria-label="Course content">
        {modules.map((mod) => {
          const isOpen = openModule === mod.id
          return (
            <div key={mod.id} className={styles.module}>
              <button
                className={`${styles.modBtn} ${isOpen ? styles.modBtnOpen : ''}`}
                onClick={() => setOpenModule(isOpen ? null : mod.id)}
                aria-expanded={isOpen}
              >
                <span className={styles.modTitle}>{mod.title}</span>
                <svg
                  width="14" height="14" viewBox="0 0 14 14" fill="none"
                  className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
                  aria-hidden="true"
                >
                  <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <div className={`${styles.lessonList} ${isOpen ? styles.lessonListOpen : ''}`}>
                {mod.lessons.map((lesson) => {
                  const isActive = activeLesson === lesson.id
                  return (
                    <button
                      key={lesson.id}
                      className={`${styles.lessonBtn} ${isActive ? styles.lessonBtnActive : ''}`}
                      onClick={() => {
                        setActiveLesson(lesson.id)
                        setOpenModule(mod.id)
                      }}
                    >
                      <span className={styles.lessonPlayIcon} aria-hidden="true">
                        {isActive
                          ? <span className={styles.playDot} />
                          : (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M2 1.5l6 3.5-6 3.5V1.5z" fill="currentColor"/>
                            </svg>
                          )}
                      </span>
                      <span className={styles.lessonTitle}>{lesson.title}</span>
                      {lesson.duration_minutes && (
                        <span className={styles.duration}>
                          {Math.floor(lesson.duration_minutes)}m
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* Right — video player */}
      <div className={styles.player}>
        {currentLesson?.youtube_video_id ? (
          <>
            <div className={styles.videoWrap}>
              {/*
                The iframe is rendered client-side ONLY for the selected lesson.
                The youtube_video_id values in props came from an RLS-gated
                server query — they are absent from the HTML for unpurchased users.
              */}
              <iframe
                key={currentLesson.id}
                src={`https://www.youtube-nocookie.com/embed/${currentLesson.youtube_video_id}?rel=0&modestbranding=1&autoplay=1&origin=${encodeURIComponent('http://localhost:3000')}`}
                title={currentLesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className={styles.iframe}
              />
            </div>
            <div className={styles.lessonInfo}>
              <p className={styles.lessonLabel}>Now Playing</p>
              <h3 className={styles.lessonName}>{currentLesson.title}</h3>
            </div>
          </>
        ) : (
          <div className={styles.noVideo}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2" y="6" width="20" height="14" rx="2" stroke="var(--color-muted)" strokeWidth="1.5"/>
              <path d="M10 9.5l5 3-5 3V9.5z" fill="var(--color-muted)"/>
            </svg>
            <p>Select a lesson to start watching</p>
          </div>
        )}
      </div>
    </div>
  )
}
