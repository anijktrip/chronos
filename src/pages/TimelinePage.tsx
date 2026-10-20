import { t } from '@/i18n'
import { Timeline } from '@/components/timeline/Timeline'
import { useDocumentTitle } from '@/components/ui/hooks'
import { Breadcrumbs } from '@/components/ui/Page'

export function TimelinePage() {
  useDocumentTitle(t('Global timeline'))
  return (
    <>
      <Breadcrumbs items={[{ label: t('Explore'), to: '/explore' }, { label: t('Global Interactive Timeline') }]} />
      <header className="page-x pb-6 pt-8">
        <p className="label mb-4">{t('Explore')}</p>
        <h1 className="page-title max-w-[16ch]">{t('Everything, at once')}</h1>
        <p className="page-intro mt-4 max-w-2xl">
          {t('Ten regional lanes share one axis. Read across a lane to follow a place; read down at a single year to see what was happening elsewhere. Overlap on this chart means overlap in time only — relationships live on the connections map.')}
        </p>
      </header>
      <div className="page-x pb-20"><Timeline /></div>
    </>
  )
}
