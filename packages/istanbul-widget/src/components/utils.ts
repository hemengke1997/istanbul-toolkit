import { ClassValue } from 'class-variance-authority/types'
import { classNames } from 'tw-clsx'

export function cn(...inputs: ClassValue[]) {
  return classNames(inputs)
}
