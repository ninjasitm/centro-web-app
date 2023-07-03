// @ts-expect-error
import mitt from 'mitt';

import type { Events } from '@/types';

// @ts-expect-error
import type Emitter from 'mitt';

// Create a new emitter
const emitter: Emitter<Events> = mitt();

// Export that emitter
export default emitter;
