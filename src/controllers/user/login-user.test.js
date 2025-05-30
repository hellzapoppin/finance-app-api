import { LoginUserController } from './login-user'
import { user } from '../../tests/index.js'
import { faker } from '@faker-js/faker'
import { InvalidPasswordError, UserNotFoundError } from '../../errors/user.js'

describe('Login User Controller', () => {
    class LoginUserUseCaseStub {
        async execute() {
            return {
                ...user,
                tokens: {
                    accessToken: 'valid_access_token',
                    refreshToken: 'valid_refresh_token',
                },
            }
        }
    }

    const makeSut = () => {
        const loginUserUseCaseStub = new LoginUserUseCaseStub()
        const sut = new LoginUserController(loginUserUseCaseStub)

        return { sut, loginUserUseCaseStub }
    }

    const httpRequest = {
        body: {
            email: faker.internet.email(),
            password: faker.internet.password(),
        },
    }

    it('shoudld return 200 for valid credentials', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(200)
        expect(result.body.tokens.accessToken).toBe('valid_access_token')
        expect(result.body.tokens.refreshToken).toBe('valid_refresh_token')
    })

    it('should return 401 if password is invalid', async () => {
        const { sut, loginUserUseCaseStub } = makeSut()
        jest.spyOn(loginUserUseCaseStub, 'execute').mockRejectedValueOnce(
            new InvalidPasswordError(),
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(401)
    })

    it('should return 404 if user is not found', async () => {
        const { sut, loginUserUseCaseStub } = makeSut()
        jest.spyOn(loginUserUseCaseStub, 'execute').mockRejectedValueOnce(
            new UserNotFoundError(),
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(404)
    })
})
