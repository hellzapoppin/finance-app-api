import { ok, serverError } from '../helpers/index.js'
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

            const transaction =
                this.deleteTransactionUseCase.execute(transactionId)

            return ok(transaction)
        } catch (error) {
            console.log(error)
            return serverError()
        }
    }
}
