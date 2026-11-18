export const cvSections = {
  education: '學歷',
  theatre: '劇場與跨域創作',
  teaching: '教育與教學',
  film: '影視相關',
  training: '嬋柔培訓',
  other: '其他工作經驗',
} as const

export const trainingStatusLabels = {
  planned: '規劃中',
  unconfirmed: '履歷載列培訓（結訓待確認）',
  completed: '已完成培訓',
  certified: '正式取得證照',
} as const

type TrainingStatus = keyof typeof trainingStatusLabels
type CvSection = keyof typeof cvSections

type ManualCvRow = {
  title: string
  year?: string
  team?: string
  venue?: string
  role?: string
  notes?: string
}
type CvRow = Partial<ManualCvRow> & { recordId?: string }
type TrainingRow = ManualCvRow & { status: TrainingStatus }

export type CvData = Partial<Record<'theatre' | 'teaching' | 'film' | 'other', CvRow[]>> & {
  education?: ManualCvRow[]
  training?: TrainingRow[]
}

type ArchiveRecord = {
  id?: string
  slug: string
  title: string
  date?: string
  year?: string
  venue?: string
  team?: string
  role?: string
  excerpt?: string
  status: string
}

export function formatCvRow(row: CvRow, status?: TrainingStatus) {
  const state = status ? trainingStatusLabels[status] : undefined
  const details = status ? [row.title, row.venue, row.team] : [row.venue, row.team, row.title]
  return [row.year, ...details, row.role, row.notes, state].filter(Boolean).join(' · ')
}

export function resolveCv(cv: CvData, records: ArchiveRecord[]) {
  const byId = new Map(records.map((entry) => [entry.id || entry.slug, entry]))
  const linked = new Set<string>()
  return (Object.keys(cvSections) as CvSection[]).map((section) => ({
    title: cvSections[section],
    rows: (cv[section] ?? []).flatMap((row, index) => {
      const location = cvSections[section] + '第 ' + (index + 1) + ' 筆'
      if (section === 'training') {
        const training = row as TrainingRow
        if (!training.title?.trim() || !Object.hasOwn(trainingStatusLabels, training.status)) {
          throw new Error(location + '需要課程名稱與正確的培訓／證照狀態。')
        }
        return [formatCvRow(training, training.status)]
      }
      const id = 'recordId' in row ? row.recordId?.trim() : undefined
      if (!id) {
        if (!row.title?.trim()) throw new Error(location + '需要名稱或內容代號。')
        return [formatCvRow(row)]
      }

      const entry = byId.get(id)
      if (!entry) throw new Error(location + '找不到創作作品或身體實踐代號：' + id)
      if (linked.has(id)) throw new Error(location + '重複引用內容代號：' + id)
      linked.add(id)
      if (entry.status !== 'published') return []
      return [formatCvRow({
        year: row.year || entry.date || entry.year,
        venue: row.venue || entry.venue,
        team: row.team || entry.team,
        title: row.title || '《' + entry.title + '》',
        role: row.role || entry.role,
        notes: row.notes || entry.excerpt,
      })]
    }),
  }))
}
