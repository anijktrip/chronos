/** Prints entities as JSON for translators: npx tsx scripts/dump-entities.ts <types,comma> [full|index|all] */
import { entities, relationships, questions, quizzes, paths, objectives, sources, regions } from '../src/data'
const [kinds = '', level = 'all'] = process.argv.slice(2)
const isIndex = (e: any) => e.level === 'index'
if (kinds === 'relationships') console.log(JSON.stringify(relationships.map((r) => ({ id: r.id, note: r.note, qualifier: r.qualifier })), null, 1))
else if (kinds === 'learning') console.log(JSON.stringify({ questions, quizzes, paths, objectives }, null, 1))
else if (kinds === 'sources') console.log(JSON.stringify(sources, null, 1))
else if (kinds === 'regions') console.log(JSON.stringify(regions, null, 1))
else {
  const t = kinds.split(',')
  const list = entities.filter((e) => t.includes(e.type)).filter((e) => level === 'all' || (level === 'index') === isIndex(e))
  console.log(JSON.stringify(list.map(({ ...e }: any) => { delete e.image; delete e.portrait; return e }), null, 1))
}
