import { faker } from '@faker-js/faker'
import { UpdateUserUseCase } from './update-user'

describe('Update User Use Case', () => {
    const userId = faker.string.uuid()

    const user = {
        id: userId,
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    }

    class GetUserByEmailRepositoryStub {
        async execute() {
            return null
        }
    }
    class UpdateUserRepositoryStub {
        async execute() {
            return user
        }
    }
    class PasswordHasherAdapterStub {
        async execute() {
            return 'hashed_password'
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const updateUserRepository = new UpdateUserRepositoryStub()
        const passwordHasherAdapterStub = new PasswordHasherAdapterStub()
        const sut = new UpdateUserUseCase(
            getUserByEmailRepository,
            updateUserRepository,
            passwordHasherAdapterStub,
        )

        return {
            sut,
            getUserByEmailRepository,
            updateUserRepository,
            passwordHasherAdapterStub,
        }
    }

    it('should update user successfully (without email and password)', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(userId, {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
        })

        expect(result).toEqual(user)
    })

    it('should update user successfully (with email)', async () => {
        const { sut, getUserByEmailRepository } = makeSut()
        const executeSpy = jest.spyOn(getUserByEmailRepository, 'execute')

        const email = faker.internet.email()
        const result = await sut.execute(userId, {
            email,
        })

        expect(executeSpy).toHaveBeenCalledWith(email)
        expect(result).toEqual(user)
    })
})
