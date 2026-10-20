import { useEffect, useState } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { t } from '@/i18n'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { SearchDialog } from './components/layout/SearchDialog'
import { useDocumentTitle } from './components/ui/hooks'
import { ArtistDetail } from './pages/ArtistDetail'
import { ArtistRelationships, ArtistsPage } from './pages/Artists'
import { ArtworkDetail } from './pages/ArtworkDetail'
import { ArtworksPage, ComparePage } from './pages/Artworks'
import { ConnectionsPage } from './pages/Connections'
import { CoveragePage } from './pages/Coverage'
import { ContextDetail, ContextIndex } from './pages/Context'
import { ExploreOverview, GeographyPage, PeriodsPage, RegionPage } from './pages/Explore'
import { Home } from './pages/Home'
import { LearnHome, PathPage, ProgressPage, QuizPage, QuizzesPage, SavedPage } from './pages/Learn'
import { MovementDetail } from './pages/MovementDetail'
import { MovementsPage } from './pages/Movements'
import { SearchPage } from './pages/SearchPage'
import { TimelinePage } from './pages/TimelinePage'

function ScrollManager() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }) }, [pathname])
  return null
}

function NotFound() {
  useDocumentTitle(t('Not found'))
  return (
    <div className="page-x py-24">
      <p className="label">404</p>
      <h1 className="page-title mt-4">{t('Nothing here — yet.')}</h1>
      <p className="page-intro mt-4 max-w-lg">{t('That page isn’t part of the sample dataset. Try the timeline or search.')}</p>
      <div className="mt-8 flex gap-3"><Link to="/" className="btn btn-solid">{t('Home')}</Link><Link to="/explore/timeline" className="btn btn-ghost">{t('Open the timeline')}</Link></div>
    </div>
  )
}

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false)
  const loc = useLocation()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement
      const typing = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable)
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) { e.preventDefault(); setSearchOpen(true) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <a href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }}
        className="fixed left-3 top-3 z-[100] -translate-y-24 bg-ink px-4 py-3 text-sm text-paper focus:translate-y-0">{t('Skip to content')}</a>
      <Header onSearch={() => setSearchOpen(true)} />
      <ScrollManager />
      <main id="main" tabIndex={-1} key={loc.pathname} className="page-enter min-h-[70vh] outline-none">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/explore" element={<ExploreOverview />} />
          <Route path="/explore/timeline" element={<TimelinePage />} />
          <Route path="/explore/geography" element={<GeographyPage />} />
          <Route path="/explore/geography/:regionId" element={<RegionPage />} />
          <Route path="/explore/periods" element={<PeriodsPage />} />
          <Route path="/explore/periods/:slug" element={<ContextDetail kind="period" />} />
          <Route path="/explore/browse" element={<SearchPage />} />
          <Route path="/explore/coverage" element={<CoveragePage />} />
          <Route path="/search" element={<SearchPage />} />

          <Route path="/movements" element={<MovementsPage />} />
          <Route path="/movements/:slug" element={<MovementDetail />} />

          <Route path="/artists" element={<ArtistsPage />} />
          <Route path="/artists/relationships" element={<ArtistRelationships />} />
          <Route path="/artists/:slug" element={<ArtistDetail />} />

          <Route path="/artworks" element={<ArtworksPage />} />
          <Route path="/artworks/compare" element={<ComparePage />} />
          <Route path="/artworks/:slug" element={<ArtworkDetail />} />

          <Route path="/connections" element={<ConnectionsPage />} />
          <Route path="/connections/events" element={<ContextIndex kind="event" />} />
          <Route path="/connections/events/:slug" element={<ContextDetail kind="event" />} />
          <Route path="/connections/exchanges" element={<ContextIndex kind="exchange" />} />
          <Route path="/connections/exchanges/:slug" element={<ContextDetail kind="exchange" />} />
          <Route path="/connections/themes" element={<ContextIndex kind="theme" />} />
          <Route path="/connections/themes/:slug" element={<ContextDetail kind="theme" />} />
          <Route path="/places/:slug" element={<ContextDetail kind="place" />} />

          <Route path="/learn" element={<LearnHome />} />
          <Route path="/learn/path/:id" element={<PathPage />} />
          <Route path="/learn/quizzes" element={<QuizzesPage />} />
          <Route path="/learn/quiz/:id" element={<QuizPage />} />
          <Route path="/learn/progress" element={<ProgressPage />} />
          <Route path="/learn/saved" element={<SavedPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
