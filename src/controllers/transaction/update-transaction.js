import { ZodError } from 'zod'
import { updateTransactionSchema } from '../../schemas/transactions.js'
import {
    badRequest,
    checkIfUUIDIsValid,
    forbidden,
    invalidIdResponse,
    ok,
    serverError,
    transactionNotFoundResponse,
} from '../helpers/index.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'
import { ForbiddenError } from '../../errors/user.js'

export class UpdateTransactionController {
    constructor(updateTransactionUseCase) {
        this.updateTransactionUseCase = updateTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            const idIsValid = checkIfUUIDIsValid(
                httpRequest.params.transactionId,
            )

            if (!idIsValid) {
                return invalidIdResponse()
            }

            await updateTransactionSchema.parseAsync(params)

            const transction = await this.updateTransactionUseCase.execute(
                httpRequest.params.transactionId,
                params,
            )

            return ok(transction)
        } catch (error) {
            console.log(error)
            if (error instanceof ZodError) {
                return badRequest({ message: error.errors[0].message })
            }
            if (error instanceof TransactionNotFoundError) {
                return transactionNotFoundResponse()
            }

            if (error instanceof ForbiddenError) {
                return forbidden()
            }
            return serverError()
        }
    }
}
