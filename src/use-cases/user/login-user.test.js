import { LoginUserUseCase } from './login-user'
import { InvalidPasswordError, UserNotFoundError } from '../../errors/user'
import { user } from '../../tests/index.js'

describe('Login User Use Case', () => {
    class GetUserByEmailRepositoryStub {
        async execute() {
            return user
        }
    }
    class PasswordComparatorAdapterStub {
        async execute() {
            return true
        }
    }
    class TokensGeneratorAdapterStub {
        async execute() {
            return {
                accessToken: 'access_token',
                refreshToken: 'refresh_token',
            }
        }
    }
    const makeSut = () => {
        const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub()
        const tokensGeneratorAdapterStub = new TokensGeneratorAdapterStub()
        const passwordComparatorAdapterStub =
            new PasswordComparatorAdapterStub()

        const sut = new LoginUserUseCase(
            getUserByEmailRepositoryStub,
            passwordComparatorAdapterStub,
            tokensGeneratorAdapterStub,
        )

        return {
            sut,
            getUserByEmailRepositoryStub,
            passwordComparatorAdapterStub,
            tokensGeneratorAdapterStub,
        }
    }

    it('should throw UserNotFoundError if user is not found', async () => {
        const { sut, getUserByEmailRepositoryStub } = makeSut()
        jest.spyOn(
            getUserByEmailRepositoryStub,
            'execute',
        ).mockResolvedValueOnce(null)

        const promise = sut.execute('email', 'password')

        expect(promise).rejects.toThrow(new UserNotFoundError())
    })

    it('should throw InvalidPasswordError if password is invalid', async () => {
        const { sut, passwordComparatorAdapterStub } = makeSut()
        jest.spyOn(
            passwordComparatorAdapterStub,
            'execute',
        ).mockReturnValueOnce(false)

        const promise = sut.execute('email', 'password')

        expect(promise).rejects.toThrow(new InvalidPasswordError())
    })

    it('should return user with tokens', async () => {
        const { sut } = makeSut()

        const result = await sut.execute('email', 'password')

        expect(result.tokens.accessToken).toBeDefined()
    })
})
