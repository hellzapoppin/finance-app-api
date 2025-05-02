import { badRequest, notFound } from './http.js'
import validator from 'validator'

export const invalidPasswordResponse = () =>
    badRequest({
        message: 'Password must be at least 6 characters long',
    })

export const invalidEmailResponse = () =>
    badRequest({ message: 'Invalid email format' })

export const invalidIdResponse = () =>
    badRequest({ message: 'Invalid ID format' })

export const userNotFoundResponse = () =>
    notFound({ message: 'User not found' })

export const checkIPasswordIsValid = (password) => password.length >= 6

export const checkIfEmailIsValid = (email) => validator.isEmail(email)

export const checkIfUUIDIsValid = (id) => validator.isUUID(id)
