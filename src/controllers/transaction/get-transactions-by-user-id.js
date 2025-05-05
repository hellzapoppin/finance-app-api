import { UserNotFoundError } from '../../errors/user.js'
import {
    checkIfUUIDIsValid,
    invalidIdResponse,
    ok,
    requiredFieldsIsMissingResponse,
    serverError,
    userNotFoundResponse,
} from '../helpers/index.js'

export class GetTransactionsByUserIdController {
    constructor(getTransactionsByUserIdUseCase) {
        this.getTransactionsByUserIdUseCase = getTransactionsByUserIdUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.query.user_id

            if (!userId) {
                return requiredFieldsIsMissingResponse('user_id')
            }

            const userIdIsValid = checkIfUUIDIsValid(userId)

            if (!userIdIsValid) {
                return invalidIdResponse()
            }

            const transactions =
                await this.getTransactionsByUserIdUseCase.execute({
                    user_id: userId,
                })

            return ok(transactions)
        } catch (error) {
            console.log(error)
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }
            return serverError()
        }
    }
}
