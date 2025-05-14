import { faker } from '@faker-js/faker'
import { CreateTransactionUseCase } from './create-transaction'

describe('Create Transaction Use Case', () => {
    const userId = faker.string.uuid()

    const CreateTransactionParams = {
        user_id: userId,
        name: faker.book.title(),
        date: faker.date.anytime().toISOString(),
        amount: Number(faker.finance.amount()),
        type: faker.helpers.arrayElements(['EARNING', 'EXPENSE', 'INVESTMENT']),
    }

    class CreateTransactionRepositoryStub {
        async execute(transaction) {
            return transaction
        }
    }
    class GetUserByIdRepositoryStub {
        async execute(userId) {
            return {
                id: userId,
                fist_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            }
        }
    }
    class IdGeneratorAdapterStub {
        execute() {
            return 'generated_id'
        }
    }

    const makeSut = () => {
        const createTransactionRepository =
            new CreateTransactionRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const idGeneratorAdapter = new IdGeneratorAdapterStub()

        const sut = new CreateTransactionUseCase(
            createTransactionRepository,
            getUserByIdRepository,
            idGeneratorAdapter,
        )

        return {
            sut,
            createTransactionRepository,
            getUserByIdRepository,
            idGeneratorAdapter,
        }
    }

    it('should create a transaction successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(CreateTransactionParams)

        expect(result).toEqual({
            ...CreateTransactionParams,
            id: 'generated_id',
        })
    })
})
