import { EmailAlreadyInUseError } from '../../errors/user.js'
import { createUserSchema } from '../../schemas/index.js'
import { badRequest, create, serverError } from '../helpers/index.js'
import { ZodError } from 'zod'

export class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            await createUserSchema.parseAsync(params)

            // chamar o use case
            const createdUser = await this.createUserUseCase.execute(params)

            // retornar a resposta para o usuário (status code)
            return create(createdUser)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.errors[0].message,
                })
            }
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }
            console.log(error)
            return serverError()
        }
    }
}
