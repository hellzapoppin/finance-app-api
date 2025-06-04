import {
    ok,
    serverError,
    transactionNotFoundResponse,
} from '../helpers/index.js'
import {
    checkIfUUIDIsValid,
    invalidIdResponse,
} from '../helpers/validations.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'

export class DeleteTransactionController {
    constructor(deleteTransactionUseCase) {
        this.deleteTransactionUseCase = deleteTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const transactionId = httpRequest.params.transactionId
            const userId = httpRequest.params.user_id
            const idIsValid = checkIfUUIDIsValid(transactionId)
            if (!idIsValid) {
                return invalidIdResponse()
            }

            const deletedTransaction =
                await this.deleteTransactionUseCase.execute(
                    transactionId,
                    userId,
                )

            return ok(deletedTransaction)
        } catch (error) {
            console.log(error)
            if (error instanceof TransactionNotFoundError) {
                return transactionNotFoundResponse()
            }
            return serverError()
        }
    }
}
