import { InvalidPasswordError, UserNotFoundError } from '../../errors/user.js'

export class LoginUserUseCase {
    constructor(
        getUserByEmailRepository,
        passwordComparatorAdapter,
        tokensGeneratorAdapter,
    ) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.passwordComparatorAdapter = passwordComparatorAdapter
        this.tokensGeneratorAdapter = tokensGeneratorAdapter
    }
    async execute(email, password) {
        const user = await this.getUserByEmailRepository.execute(email)
        if (!user) {
            throw new UserNotFoundError()
        }

        const isPasswordValid = this.passwordComparatorAdapter.execute(
            password,
            user.password,
        )

        if (!isPasswordValid) {
            throw new InvalidPasswordError()
        }

        const tokens = await this.tokensGeneratorAdapter.execute(user.id)

        return {
            ...user,
            tokens,
        }
    }
}
