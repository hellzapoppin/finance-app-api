import validator from 'validator'
import {
    badRequest,
    checkIfUUIDIsValid,
    invalidIdResponse,
    create,
    validateRequiredFields,
    requiredFieldsIsMissingResponse,
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

            const amountIsValid = validator.isCurrency(
                params.amount.toString(),
                {
                    digits_after_decimal: [2],
                    allow_negative: false,
                    decimal_separator: '.',
                },
            )

            if (!amountIsValid) {
                return badRequest({
                    message: 'The amount must be a valid currency',
                })
            }

            const type = params.type.trim().toUpperCase()

            const typeIsValid = ['EARNING', 'EXPENSE', 'INVESTIMENT'].includes(
                type,
            )

            if (!typeIsValid) {
                return badRequest({
                    message: 'The type must be EARNING, EXPENSE or INVESTIMENT',
                })
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
