import { faker } from '@faker-js/faker'
import { CreateUserUseCase } from './create-user'

describe('Create User Use Case', () => {
    class GetUserByEmailRepositoryStub {
        async execute() {
            return null
        }
    }

    class CreateUserRepositoryStub {
        async execute(user) {
            return user
        }
    }

    class PasswordHasherAdapterStub {
        async execute() {
            return 'hashed_password'
        }
    }

    class IdGeneratorAdapterStub {
        async execute() {
            return 'generated_id'
        }
    }

    const makeSut = () => {
        const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub()
        const createUserRepositoryStub = new CreateUserRepositoryStub()
        const passwordHasherAdapterStub = new PasswordHasherAdapterStub()
        const idGeneratorAdapterStub = new IdGeneratorAdapterStub()
        const sut = new CreateUserUseCase(
            getUserByEmailRepositoryStub,
            createUserRepositoryStub,
            passwordHasherAdapterStub,
            idGeneratorAdapterStub,
        )

        return {
            sut,
            getUserByEmailRepositoryStub,
            createUserRepositoryStub,
            passwordHasherAdapterStub,
            idGeneratorAdapterStub,
        }
    }
    it('should successfully create a user', async () => {
        const { sut } = makeSut()

        const createdUser = await sut.execute({
            fist_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 7 }),
        })

        expect(createdUser).toBeTruthy()
    })
})
