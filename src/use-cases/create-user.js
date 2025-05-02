import { v4 as uuidv4 } from 'uuid'
import bycrypt from 'bcrypt'
import {
    PostgresGetUserByEmailRepository,
    PostgresCreateUserRepository,
} from '../repositories/postgres/index.js'
import { EmailAlreadyInUseError } from '../errors/user.js'
export class CreateUserUseCase {
    async execute(createUserParams) {
        // TODO: verificar se o email já está em uso
        const postgresGetUserByEmailRepository =
            new PostgresGetUserByEmailRepository()
        const userAlreadyExists =
            await postgresGetUserByEmailRepository.execute(
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

        const postgresCreateUserRepository = new PostgresCreateUserRepository()

        const createdUser = await postgresCreateUserRepository.execute(user)

        return createdUser
    }
}
