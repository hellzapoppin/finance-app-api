import { EmailAlreadyInUseError } from '../errors/user.js'
import { UpdateUserUseCase } from '../use-cases/update-user.js'
import { badRequest, ok, serverError } from './helpers.js'
import validator from 'validator'

export class UpdateUserController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            const isIdValid = validator.isUUID(userId)

            if (!isIdValid) {
                return badRequest({ message: 'Invalid ID format' })
            }

            const updateUserParams = httpRequest.body

            const allowedFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            const someFieldsIsNotAllowed = Object.keys(updateUserParams).some(
                (field) => !allowedFields.includes(field),
            )

            if (someFieldsIsNotAllowed) {
                return badRequest({
                    message: 'Some provided fields are not allowed',
                })
            }

            if (updateUserParams.password) {
                const passwordIsValid = updateUserParams.password.length > 6

                if (!passwordIsValid) {
                    return badRequest({
                        message: 'Password must be at least 6 characters long',
                    })
                }
            }

            if (updateUserParams.email) {
                const emailIsValid = validator.isEmail(updateUserParams.email)

                if (!emailIsValid) {
                    return badRequest({
                        message: 'Invalid email format',
                    })
                }
            }

            const updateUserUseCase = new UpdateUserUseCase()
            const updatedUser = await updateUserUseCase.execute(
                userId,
                updateUserParams,
            )

            return ok(updatedUser)
        } catch (error) {
            console.log(error)
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }
            return serverError()
        }
    }
}
