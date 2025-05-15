import { faker } from '@faker-js/faker'
import { UpdateUserUseCase } from './update-user'
import { EmailAlreadyInUseError } from '../../errors/user'
import { user } from '../../tests/index.js'

describe('Update User Use Case', () => {
    const userId = faker.string.uuid()
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
        const passwordHasherAdapter = new PasswordHasherAdapterStub()
        const sut = new UpdateUserUseCase(
            getUserByEmailRepository,
            updateUserRepository,
            passwordHasherAdapter,
        )

        return {
            sut,
            getUserByEmailRepository,
            updateUserRepository,
            passwordHasherAdapter,
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

    it('should update user successfully (with password)', async () => {
        const { sut, passwordHasherAdapter } = makeSut()
        const executeSpy = jest.spyOn(passwordHasherAdapter, 'execute')

        const password = faker.internet.password()
        const result = await sut.execute(userId, {
            password,
        })

        expect(executeSpy).toHaveBeenCalledWith(password)
        expect(result).toEqual(user)
    })

    it('should throw EmailAlreadyInUseError if email is already in use', async () => {
        const { sut, getUserByEmailRepository } = makeSut()
        jest.spyOn(getUserByEmailRepository, 'execute').mockResolvedValueOnce(
            user,
        )

        const promise = sut.execute(faker.string.uuid(), {
            email: user.email,
        })

        expect(promise).rejects.toThrow(new EmailAlreadyInUseError(user.email))
    })

    it('should call UpdateUserRepository with correct params', async () => {
        const { sut, updateUserRepository } = makeSut()
        const executeSpy = jest.spyOn(updateUserRepository, 'execute')

        const updateUserParams = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        }

        await sut.execute(userId, updateUserParams)

        expect(executeSpy).toHaveBeenCalledWith(userId, {
            ...updateUserParams,
            password: 'hashed_password',
        })
    })

    it('should throws if GetUserByEmailRepository throws', async () => {
        const { sut, getUserByEmailRepository } = makeSut()
        jest.spyOn(getUserByEmailRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(userId, { email: faker.internet.email() })

        expect(promise).rejects.toThrow()
    })

    it('should throws if PasswordHasherAdapter throws', async () => {
        const { sut, passwordHasherAdapter } = makeSut()
        jest.spyOn(passwordHasherAdapter, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(userId, {
            password: faker.internet.password(),
        })

        expect(promise).rejects.toThrow()
    })

    it('should throws if UpdateUserRepository throws', async () => {
        const { sut, updateUserRepository } = makeSut()
        jest.spyOn(updateUserRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(userId, {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        })

        expect(promise).rejects.toThrow()
    })
})
