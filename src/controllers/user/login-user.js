import {
    badRequest,
    notFound,
    ok,
    serverError,
    unauthorized,
} from '../helpers/index.js'
import { loginUserSchema } from '../../schemas/index.js'
import { InvalidPasswordError, UserNotFoundError } from '../../errors/user.js'
import { ZodError } from 'zod'

export class LoginUserController {
    constructor(loginUserUseCase) {
        this.loginUserUseCase = loginUserUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            const user = await this.loginUserUseCase.execute(
                params.email,
                params.password,
            )
            await loginUserSchema.parseAsync(params)
            return ok(user)
        } catch (error) {
            console.log(error)
            if (error instanceof ZodError) {
                return badRequest({ message: error.errors[0].message })
            }
            if (error instanceof InvalidPasswordError) {
                return unauthorized()
            }
            if (error instanceof UserNotFoundError) {
                return notFound('User not found')
            }
            return serverError()
        }
    }
}
