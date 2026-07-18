'use client'

import { useState } from 'react'
import styles from './CurriculumAccordion.module.css'

export interface Lesson {
  id: string
  title: string
  duration_minutes: number | null
  position: number
}

export interface Module {
  id: string
  title: string
  position: number
  lessons: Lesson[]
}

interface CurriculumAccordionProps {
  modules: Module[]
  /** If true, all modules start open; otherwise first one only */
  defaultOpenAll?: boolean
}

export default function CurriculumAccordion({ modules, defaultOpenAll = false }: CurriculumAccordionProps) {
  const [openModules, setOpenModules] = useState<Set<string>>(
    () => new Set(defaultOpenAll ? modules.map(m => m.id) : [modules[0]?.id])
  )

  const toggle = (id: string) => {
    setOpenModules(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0)
  const totalMinutes = modules.reduce((s, m) =>
    s + m.lessons.reduce((ls, l) => ls + (l.duration_minutes ?? 0), 0), 0)

  const fmtDuration = (min: number) => {
    const h = Math.floor(min / 60)
    const m = Math.round(min % 60)
    return h > 0 ? `${h}h ${m}m` : `${m}m`
  }

  return (
    <section className={styles.wrapper} aria-label="Course curriculum">
      {/* Summary row */}
      <div className={styles.summary}>
        <span className="mono" style={{ color: 'var(--color-secondary)' }}>
          {modules.length} modules
        </span>
        <span className={styles.dot} aria-hidden="true" />
        <span className="mono" style={{ color: 'var(--color-secondary)' }}>
          {totalLessons} lessons
        </span>
        <span className={styles.dot} aria-hidden="true" />
        <span className="mono" style={{ color: 'var(--color-secondary)' }}>
          {fmtDuration(totalMinutes)} total
        </span>
      </div>

      {/* Accordion */}
      <div className={styles.accordion} role="list">
        {modules.map((mod, idx) => {
          const isOpen = openModules.has(mod.id)
          const modMinutes = mod.lessons.reduce((s, l) => s + (l.duration_minutes ?? 0), 0)
          const panelId = `panel-${mod.id}`
          const btnId  = `btn-${mod.id}`

          return (
            <div key={mod.id} className={styles.module} role="listitem">
              {/* Module header */}
              <button
                id={btnId}
                className={styles.moduleHeader}
                onClick={() => toggle(mod.id)}
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span className={styles.modNumber} aria-hidden="true">
                  {String(idx).padStart(2, '0')}
                </span>
                <span className={styles.modTitle}>{mod.title}</span>
                <span className={styles.modMeta}>
                  <span className="mono" style={{ color: 'var(--color-muted)', fontSize: '0.72rem' }}>
                    {mod.lessons.length} lessons · {fmtDuration(modMinutes)}
                  </span>
                  <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 5.5L7 9.5L11 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </span>
              </button>

              {/* Lesson list — inner div required for grid-template-rows animation trick */}
              <div
                id={panelId}
                role="region"
                aria-labelledby={btnId}
                className={`${styles.lessonList} ${isOpen ? styles.lessonListOpen : ''}`}
              >
                <div>
                  {mod.lessons
                    .sort((a, b) => a.position - b.position)
                    .map((lesson) => (
                      <div key={lesson.id} className={styles.lesson}>
                        <span className={styles.lockIcon} aria-label="Locked — enroll to watch">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <rect x="2" y="5" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                            <path d="M4 5V3.5a2 2 0 0 1 4 0V5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                          </svg>
                        </span>
                        <span className={styles.lessonTitle}>{lesson.title}</span>
                        {lesson.duration_minutes && (
                          <span className={styles.lessonDur}>
                            {fmtDuration(lesson.duration_minutes)}
                          </span>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
