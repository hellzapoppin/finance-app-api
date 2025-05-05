import validator from 'validator'
import { badRequest } from './http.js'

export const checkIfUUIDIsValid = (id) => validator.isUUID(id)

export const invalidIdResponse = () =>
    badRequest({ message: 'Invalid ID format' })
