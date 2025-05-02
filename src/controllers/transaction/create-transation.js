import validator from 'validator'
import {
    badRequest,
    checkIfUUIDIsValid,
    invalidIdResponse,
    created,
} from '../helpers'
import { UserNotFoundError } from '../../errors/user'

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            const requiredFields = ['user_id', 'name', 'date', 'amount', 'type']

            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().length === 0) {
                    return badRequest({ message: `Missing param: ${field}` })
                }
            }

            const userIdIsValid = checkIfUUIDIsValid(params.user_id)

            if (!userIdIsValid) {
                return invalidIdResponse()
            }

            if (params.amount < 0) {
                return badRequest({ message: 'Amount must be greater than 0' })
            }

            const amountIsValid = validator.isCurrency(params.amount.toString, {
                digits_after_decimal: 2,
                allow_negative: false,
                decimal_separator: '.',
            })

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

            return created(createdTransaction)
        } catch (error) {
            console.log(error)
            if (error instanceof UserNotFoundError) {
                return badRequest({ message: error.message })
            }
        }
    }
}
