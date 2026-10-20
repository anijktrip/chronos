import { core } from './core'
import { explore } from './explore'
import { images } from './images'
import { learn } from './learn'
import { people } from './people'
import { relations } from './relations'
import { works } from './works'

/** English source string → Greek. One file per area; later files win on a clash. */
export const el: Record<string, string> = { ...core, ...explore, ...people, ...works, ...learn, ...relations, ...images }
