import {
    badRequest,
    checkIfUUIDIsValid,
    invalidIdResponse,
    create,
    validateRequiredFields,
    requiredFieldsIsMissingResponse,
    checkIfAmountIsValid,
    checkIfTypeIsValid,
    invalidAmountResponse,
    invalidTypeResponse,
} from '../helpers/index.js'
import { UserNotFoundError } from '../../errors/user.js'

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            const requiredFields = ['user_id', 'name', 'date', 'amount', 'type']

            const { ok: requiredFieldWereProvided, missingField } =
                validateRequiredFields(params, requiredFields)

            if (!requiredFieldWereProvided) {
                return requiredFieldsIsMissingResponse(missingField)
            }

            const userIdIsValid = checkIfUUIDIsValid(params.user_id)

            if (!userIdIsValid) {
                return invalidIdResponse()
            }

            const amountIsValid = checkIfAmountIsValid(params.amount)

            if (!amountIsValid) {
                return invalidAmountResponse()
            }

            const type = params.type.trim().toUpperCase()

            const typeIsValid = checkIfTypeIsValid(type)

            if (!typeIsValid) {
                return invalidTypeResponse()
            }

            const transation = {
                ...params,
                type,
            }

            const createdTransaction =
                await this.createTransactionUseCase.execute(transation)

            return create(createdTransaction)
        } catch (error) {
            console.log(error)
            if (error instanceof UserNotFoundError) {
                return badRequest({ message: error.message })
            }
        }
    }
}
