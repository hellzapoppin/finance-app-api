import { CreateUserUseCase } from '../use-cases/create-user.js'
import { EmailAlreadyInUseError } from '../errors/user.js'
import {
    checkIfEmailIsValid,
    checkIPasswordIsValid,
    invalidEmailResponse,
    invalidPasswordResponse,
    badRequest,
    create,
    serverError,
} from './helpers/index.js'

export class CreateUserController {
    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            // validar a requisição (campos obrigatórios, tamanho de senha, email válido)
            const requiredFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().length === 0) {
                    return badRequest({ message: `Missing param: ${field}` })
                }
            }

            const passwordIsValid = checkIPasswordIsValid(params.password)

            if (!passwordIsValid) {
                return invalidPasswordResponse()
            }

            const emailIsValid = checkIfEmailIsValid(params.email)

            if (!emailIsValid) {
                return invalidEmailResponse()
            }

            // chamar o use case
            const createUserUseCase = new CreateUserUseCase()

            const createdUser = await createUserUseCase.execute(params)

            // retornar a resposta para o usuário (status code)
            return create(createdUser)
        } catch (error) {
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }
            console.log(error)
            return serverError()
        }
    }
}
