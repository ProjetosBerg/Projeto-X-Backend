// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import { ValidationError } from 'yup'

declare module 'yup' {
  // eslint-disable-next-line no-shadow
  interface ValidationError {
    statusCode?: number
  }
}
