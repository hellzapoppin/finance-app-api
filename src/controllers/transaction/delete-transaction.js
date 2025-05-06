import {
    ok,
    serverError,
    transactionNotFoundResponse,
} from '../helpers/index.js'
import {
    checkIfUUIDIsValid,
    invalidIdResponse,
} from '../helpers/validations.js'

export class DeleteTransactionController {
    constructor(deleteTransactionUseCase) {
        this.deleteTransactionUseCase = deleteTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const transactionId = httpRequest.params.transactionId
            const idIsValid = checkIfUUIDIsValid(transactionId)
            if (!idIsValid) {
                return invalidIdResponse()
            }

            const deletedTransaction =
                await this.deleteTransactionUseCase.execute(transactionId)

            if (!deletedTransaction) {
                return transactionNotFoundResponse()
            }

            return ok(deletedTransaction)
        } catch (error) {
            console.log(error)
            return serverError()
        }
    }
}
