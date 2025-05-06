import { UserNotFoundError } from '../../errors/user.js'
import {
    checkIfUUIDIsValid,
    invalidIdResponse,
    ok,
    serverError,
    userNotFoundResponse,
} from '../helpers/index.js'

export class GetUserBalanceController {
    constructor(getUserBalanceUseCase) {
        this.getUserBalanceUseCase = getUserBalanceUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId
            const idIsValid = checkIfUUIDIsValid(userId)

            if (!idIsValid) {
                return invalidIdResponse()
            }

            const balance = this.getUserBalanceUseCase.execute({ userId })

            return ok(balance)
        } catch (error) {
            console.log(error)
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }
            return serverError()
        }
    }
}
