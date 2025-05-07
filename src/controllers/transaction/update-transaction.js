import { ZodError } from 'zod'
import { updateTransactionSchema } from '../../schemas/transactions.js'
import {
    badRequest,
    checkIfUUIDIsValid,
    invalidIdResponse,
    ok,
    serverError,
} from '../helpers/index.js'

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
            return serverError()
        }
    }
}
