import { v4 as uuidv4 } from 'uuid'
import bycrypt from 'bcrypt'
import { EmailAlreadyInUseError } from '../errors/user.js'
export class CreateUserUseCase {
    constructor(
        postgresGetUserByEmailRepository,
        postgresCreateUserRepository,
    ) {
        this.postgresGetUserByEmailRepository = postgresGetUserByEmailRepository
        this.postgresCreateUserRepository = postgresCreateUserRepository
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
        const userId = uuidv4()

        // criptografar senha
        const hashedPassword = await bycrypt.hash(createUserParams.password, 10)

        // inserir o usuário no banco de dados
        const user = {
            id: userId,
            ...createUserParams,
            password: hashedPassword,
        }

        const createdUser =
            await this.postgresCreateUserRepository.execute(user)

        return createdUser
    }
}
