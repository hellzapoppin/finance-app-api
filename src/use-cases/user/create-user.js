import { EmailAlreadyInUseError } from '../../errors/user.js'
export class CreateUserUseCase {
    constructor(
        postgresGetUserByEmailRepository,
        postgresCreateUserRepository,
        passwordHasherAdapter,
        idGeneratorAdapter,
        tokensGeneratorAdapter,
    ) {
        this.postgresGetUserByEmailRepository = postgresGetUserByEmailRepository
        this.postgresCreateUserRepository = postgresCreateUserRepository
        this.passwordHasherAdapter = passwordHasherAdapter
        this.idGeneratorAdapter = idGeneratorAdapter
        this.tokensGeneratorAdapter = tokensGeneratorAdapter
    }
    async execute(createUserParams) {
        // TODO: verificar se o email já está em uso
        const userAlreadyExists =
            await this.postgresGetUserByEmailRepository.execute(
                createUserParams.email,
            )
        if (userAlreadyExists) {
            throw new EmailAlreadyInUseError(createUserParams.email)
        }

        // gerar ID do usuárionpm i uuid
        const userId = this.idGeneratorAdapter.execute()

        // criptografar senha
        const hashedPassword = await this.passwordHasherAdapter.execute(
            createUserParams.password,
        )

        // inserir o usuário no banco de dados
        const user = {
            id: userId,
            ...createUserParams,
            password: hashedPassword,
        }

        const createdUser =
            await this.postgresCreateUserRepository.execute(user)

        return {
            ...createdUser,
            tokens: await this.tokensGeneratorAdapter.execute(userId),
        }
    }
}
