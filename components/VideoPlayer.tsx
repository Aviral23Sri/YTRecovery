/**
 * VideoPlayer — pure Server Component.
 *
 * This file has NO 'use client' directive.
 * The iframe is rendered on the server only when the caller (DashboardPage)
 * has already confirmed purchase via an RLS-gated DB query.
 * The video is NEVER in the HTML for unpurchased users — not hidden with CSS.
 */
import styles from './VideoPlayer.module.css'

interface VideoPlayerProps {
  youtubeVideoId: string
  title: string
}

export default function VideoPlayer({ youtubeVideoId, title }: VideoPlayerProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.aspectBox}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?rel=0&modestbranding=1&origin=${encodeURIComponent('http://localhost:3000')}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          className={styles.iframe}
        />
      </div>
      <p className={styles.caption}>{title}</p>
    </div>
  )
}
