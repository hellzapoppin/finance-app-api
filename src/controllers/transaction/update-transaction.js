import {
    badRequest,
    checkIfAmountIsValid,
    checkIfTypeIsValid,
    checkIfUUIDIsValid,
    invalidAmountResponse,
    invalidIdResponse,
    invalidTypeResponse,
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

            const allowedFields = ['name', 'date', 'amount', 'type']

            const someFieldsIsNotAllowed = Object.keys(params).some(
                (field) => !allowedFields.includes(field),
            )

            if (someFieldsIsNotAllowed) {
                return badRequest({
                    message: 'Some provided fields are not allowed',
                })
            }

            const idIsValid = checkIfUUIDIsValid(
                httpRequest.params.transactionId,
            )

            if (!idIsValid) {
                return invalidIdResponse()
            }

            if (params.amount) {
                const amountIsValid = checkIfAmountIsValid(params.amount)

                if (!amountIsValid) {
                    return invalidAmountResponse()
                }
            }

            if (params.type) {
                const typeIsValid = checkIfTypeIsValid(params.type)

                if (!typeIsValid) {
                    return invalidTypeResponse()
                }
            }

            const transction = await this.updateTransactionUseCase.execute(
                httpRequest.params.transactionId,
                params,
            )

            return ok(transction)
        } catch (error) {
            console.log(error)
            return serverError()
        }
    }
}
