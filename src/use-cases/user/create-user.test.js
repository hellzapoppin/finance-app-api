import { CreateUserUseCase } from './create-user'
import { EmailAlreadyInUseError } from '../../errors/user'
import { user as fixtureUser } from '../../tests/index.js'

describe('Create User Use Case', () => {
    // eslint-disable-next-line no-unused-vars
    const { id, ...user } = fixtureUser

    class GetUserByEmailRepositoryStub {
        async execute() {
            return null
        }
    }

    class CreateUserRepositoryStub {
        async execute() {
            return user
        }
    }

    class PasswordHasherAdapterStub {
        async execute() {
            return 'hashed_password'
        }
    }

    class IdGeneratorAdapterStub {
        execute() {
            return 'generated_id'
        }
    }

    class TokenGeneratorAdapterStub {
        async execute() {
            return {
                accessToken: 'valid_access_token',
                refreshToken: 'valid_refresh_token',
            }
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const createUserRepository = new CreateUserRepositoryStub()
        const passwordHasherAdapter = new PasswordHasherAdapterStub()
        const idGeneratorAdapter = new IdGeneratorAdapterStub()
        const tokenGeneratorAdapter = new TokenGeneratorAdapterStub()
        const sut = new CreateUserUseCase(
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
            tokenGeneratorAdapter,
        )

        return {
            sut,
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
            tokenGeneratorAdapter,
        }
    }
    it('should successfully create a user', async () => {
        const { sut } = makeSut()

        const createdUser = await sut.execute(user)

        expect(createdUser).toBeTruthy()
        expect(createdUser.tokens.accessToken).toBe('valid_access_token')
        expect(createdUser.tokens.refreshToken).toBe('valid_refresh_token')
    })

    it('should throw an EmailAlreadyInUseError if GetUserByEmailRepository returns an user', async () => {
        const { sut, getUserByEmailRepository } = makeSut()
        jest.spyOn(getUserByEmailRepository, 'execute').mockReturnValueOnce(
            user,
        )

        const promise = sut.execute(user)

        await expect(promise).rejects.toThrow(
            new EmailAlreadyInUseError(user.email),
        )
    })

    it('should call IdGeneratorAdapter to generate a random id', async () => {
        const { sut, idGeneratorAdapter, createUserRepository } = makeSut()
        const idGeneratorSpy = jest.spyOn(idGeneratorAdapter, 'execute')
        const createUserRepositorySpy = jest.spyOn(
            createUserRepository,
            'execute',
        )

        await sut.execute(user)

        expect(idGeneratorSpy).toHaveBeenCalled()
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...user,
            password: 'hashed_password',
            id: 'generated_id',
        })
    })

    it('should call PasswordHasherAdapter to crypytograph password', async () => {
        const { sut, passwordHasherAdapter, createUserRepository } = makeSut()

        const passwordHashedSpy = jest.spyOn(passwordHasherAdapter, 'execute')
        const createUserRepositorySpy = jest.spyOn(
            createUserRepository,
            'execute',
        )

        await sut.execute(user)

        expect(passwordHashedSpy).toHaveBeenCalledWith(user.password)
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...user,
            password: 'hashed_password',
            id: 'generated_id',
        })
    })

    it('should throws if GetUserByEailRepository throws', async () => {
        const { sut, getUserByEmailRepository } = makeSut()
        jest.spyOn(getUserByEmailRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(user)

        await expect(promise).rejects.toThrow()
    })

    it('should throws if IdGeneratorAdapter throws', async () => {
        const { sut, idGeneratorAdapter } = makeSut()
        jest.spyOn(idGeneratorAdapter, 'execute').mockImplementationOnce(() => {
            throw new Error()
        })

        const promise = sut.execute(user)

        await expect(promise).rejects.toThrow()
    })

    it('should throws if PasswordHasherAdapter throws', async () => {
        const { sut, passwordHasherAdapter } = makeSut()
        jest.spyOn(passwordHasherAdapter, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(user)

        await expect(promise).rejects.toThrow()
    })

    it('should throws if CreateUserRepository throws', async () => {
        const { sut, createUserRepository } = makeSut()
        jest.spyOn(createUserRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(user)

        await expect(promise).rejects.toThrow()
    })
})
