import { z } from 'zod'
import { normalizeEmail } from './normalize-email'

const passwordSchema = z
  .string()
  .min(8, 'הסיסמה חייבת להכיל לפחות 8 תווים')
  .regex(/[A-Za-z\u0590-\u05FF]/, 'הסיסמה חייבת להכיל לפחות אות אחת')
  .regex(/\d/, 'הסיסמה חייבת להכיל לפחות ספרה אחת')

const emailSchema = z
  .string()
  .trim()
  .min(1, 'נא להזין כתובת אימייל')
  .email('נא להזין כתובת אימייל תקינה')
  .transform(normalizeEmail)

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'נא להזין שם מלא'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'נא לאשר את הסיסמה'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'הסיסמאות אינן תואמות',
    path: ['confirmPassword'],
  })

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'נא להזין סיסמה'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>

export function parseRegisterInput(input: unknown) {
  return registerSchema.safeParse(input)
}

export function parseLoginInput(input: unknown) {
  return loginSchema.safeParse(input)
}
