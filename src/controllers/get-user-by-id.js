import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'
import {
    checkIfUUIDIsValid,
    invalidIdResponse,
    notFound,
    ok,
    serverError,
} from './helpers/index.js'

export class GetUserByIdController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            const isIdValid = checkIfUUIDIsValid(userId)

            if (!isIdValid) {
                return invalidIdResponse()
            }

            const getUserByIdUseCase = new GetUserByIdUseCase()

            const user = await getUserByIdUseCase.execute(userId)

            if (!user) {
                return notFound({ message: 'User not found' })
            }

            return ok(user)
        } catch (error) {
            console.log(error)
            return serverError()
        }
    }
}
