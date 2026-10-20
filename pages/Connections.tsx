import { Link, useSearchParams } from 'react-router-dom'
import { t } from '@/i18n'
import { ConnectionsGraph, PathFinder } from '@/components/graph/ConnectionsGraph'
import { useDocumentTitle } from '@/components/ui/hooks'
import { Breadcrumbs, PageHeader, SectionHeading } from '@/components/ui/Page'

export function ConnectionsPage() {
  useDocumentTitle(t('Connections map'))
  const [sp, setSp] = useSearchParams()
  return (
    <>
      <Breadcrumbs items={[{ label: t('Connections') }]} />
      <PageHeader eyebrow={t('Connections')} title={t('How things connect')}
        intro={t('Start from any artist, movement, artwork, event or exchange. The map shows only documented relationships — each with a type, a direction and a stated reason — and reveals more as you ask for it.')}>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link to="/connections/events" className="link-u">{t('Historical events')}</Link>
          <Link to="/connections/exchanges" className="link-u">{t('Cultural exchanges')}</Link>
          <Link to="/connections/themes" className="link-u">{t('Themes and influences')}</Link>
        </div>
      </PageHeader>
      <div className="page-x space-y-24 pb-24">
        <ConnectionsGraph defaultFocus="exc-japonisme" />
        <section>
          <SectionHeading label={t('Find a chain')} title={t('How are these two connected?')} />
          <PathFinder onShow={(id) => { const n = new URLSearchParams(sp); n.set('focus', id); setSp(n, { replace: true }); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
        </section>
      </div>
    </>
  )
}
