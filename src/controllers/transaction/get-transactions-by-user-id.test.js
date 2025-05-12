import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id.js'

describe('Get Transactions By User Id Controller', () => {
    class GetTransactionByUserIdUseCaseStub {
        async execute() {
            return [
                {
                    id: faker.string.uuid(),
                    user_id: faker.string.uuid(),
                    name: faker.book.title(),
                    date: faker.date.anytime().toISOString(),
                    amount: Number(faker.finance.amount()),
                    type: faker.helpers.arrayElement([
                        'EARNING',
                        'EXPENSE',
                        'INVESTMENTS',
                    ]),
                },
            ]
        }
    }

    const httpRequest = {
        query: {
            user_id: faker.string.uuid(),
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

    it('should return 400 whem missing user_id param', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({ query: { user_id: undefined } })

        expect(result.statusCode).toBe(400)
    })
})
