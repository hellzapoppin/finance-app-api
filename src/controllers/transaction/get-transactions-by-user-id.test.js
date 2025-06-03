import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id.js'
import { UserNotFoundError } from '../../errors/user.js'
import { transaction } from '../../tests/index.js'

describe('Get Transactions By User Id Controller', () => {
    const from = '2025-01-01'
    const to = '2025-01-02'
    class GetTransactionByUserIdUseCaseStub {
        async execute() {
            return [transaction]
        }
    }

    const httpRequest = {
        query: {
            user_id: faker.string.uuid(),
            from,
            to,
        },
    }

    const makeSut = () => {
        const getTransactionByUserIdUseCase =
            new GetTransactionByUserIdUseCaseStub()
        const sut = new GetTransactionsByUserIdController(
            getTransactionByUserIdUseCase,
        )

        return { sut, getTransactionByUserIdUseCase }
    }
    it('should return 200 when finding transaction by user ID successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(200)
    })

    it('should return 400 when missing user_id param', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({ query: { user_id: undefined } })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when user_id is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({ query: { user_id: 'invalid_id' } })

        expect(result.statusCode).toBe(400)
    })

    it('should return 404 when GetTransactionsByUserIdUseCase is not found', async () => {
        const { sut, getTransactionByUserIdUseCase } = makeSut()
        jest.spyOn(
            getTransactionByUserIdUseCase,
            'execute',
        ).mockRejectedValueOnce(new UserNotFoundError())

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(404)
    })

    it('should return 500 when GetTransactionsByUserIdUseCase throws a generci error', async () => {
        const { sut, getTransactionByUserIdUseCase } = makeSut()
        jest.spyOn(
            getTransactionByUserIdUseCase,
            'execute',
        ).mockRejectedValueOnce(new Error())

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(500)
    })

    it('should call GetUserByIdUseCase with correct params', async () => {
        const { sut, getTransactionByUserIdUseCase } = makeSut()
        const executeSpy = jest.spyOn(getTransactionByUserIdUseCase, 'execute')

        await sut.execute(httpRequest, from, to)

        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.query.user_id,
            from,
            to,
        )
    })
})
