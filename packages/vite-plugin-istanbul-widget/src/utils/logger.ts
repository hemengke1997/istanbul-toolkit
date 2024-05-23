import { createLogger } from 'vite'

export const logger = createLogger('info', {
  prefix: '[vite-plugin-istanbul-widget]',
})
