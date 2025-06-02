import { z } from 'zod'

export const createUserSchema = z.object({
    first_name: z
        .string({ required_error: 'Field first_name is required' })
        .trim()
        .min(1, {
            message: 'Please, provide your first name',
        }),
    last_name: z
        .string({ required_error: 'Field last_name is required' })
        .trim()
        .min(1, {
            message: 'Please, provide your last name',
        }),
    email: z
        .string({ required_error: 'Field email is required' })
        .email({
            message: 'Please, provide a valid e-mail',
        })
        .trim(),
    password: z
        .string({ required_error: 'Field password is required' })
        .trim()
        .min(6, {
            message: 'Password must be at least 6 characteres long',
        }),
})

export const updateUserSchema = createUserSchema
    .partial()
    .strict({ message: 'Some provided field is not allowed' })

export const loginUserSchema = z.object({
    email: z
        .string({ required_error: 'Field email is required' })
        .email({
            message: 'Please, provide a valid e-mail',
        })
        .trim(),
    password: z
        .string({ required_error: 'Field password is required' })
        .trim()
        .min(6, {
            message: 'Password must be at least 6 characteres long',
        }),
})

export const refreshTokenSchema = z.object({
    refreshToken: z.string().trim().min(1, {
        message: 'Refresh token is required',
    }),
})
