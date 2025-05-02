import { DeleteUserUseCase } from '../use-cases/index.js'
import {
    checkIfUUIDIsValid,
    invalidIdResponse,
    ok,
    serverError,
} from './helpers/index.js'

export class DeleteUserController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            const isIdValid = checkIfUUIDIsValid(userId)

            if (!isIdValid) {
                return invalidIdResponse()
            }

            const deleteUserUseCase = new DeleteUserUseCase()
            const deletedUser = await deleteUserUseCase.execute(userId)

            return ok(deletedUser)
        } catch (error) {
            console.log(error)
            return serverError(error)
        }
    }
}
