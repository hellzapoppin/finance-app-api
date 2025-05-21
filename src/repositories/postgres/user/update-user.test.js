import { prisma } from '../../../../prisma/prisma'
import { PostgresUpdateUserRepository } from './update-user'
import { user } from './../../../tests/index.js'
import { faker } from '@faker-js/faker'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { UserNotFoundError } from '../../../errors/user.js'

describe('Update User Repository', () => {
    const updateUserParams = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    }

    it('should update an user on DB', async () => {
        const createdUser = await prisma.user.create({ data: user })
        const sut = new PostgresUpdateUserRepository()

        const result = await sut.execute(createdUser.id, updateUserParams)

        expect(result).toStrictEqual({ ...user, ...updateUserParams })
    })

    it('should call Prisma with correct params', async () => {
        const createdUser = await prisma.user.create({ data: user })
        const sut = new PostgresUpdateUserRepository()
        const prismaSpy = jest.spyOn(prisma.user, 'update')

        await sut.execute(createdUser.id, updateUserParams)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: { id: createdUser.id },
            data: updateUserParams,
        })
    })

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresUpdateUserRepository()
        jest.spyOn(prisma.transaction, 'update').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(user.id, updateUserParams)

        expect(promise).rejects.toThrow()
    })

    it('should throw UserNotFoundError if user is not found', async () => {
        const sut = new PostgresUpdateUserRepository()
        jest.spyOn(prisma.user, 'update').mockRejectedValueOnce(
            new PrismaClientKnownRequestError('', { code: 'P2025' }),
        )

        const promise = sut.execute(user.id, updateUserParams)

        expect(promise).rejects.toThrow(new UserNotFoundError(user.id))
    })
})
