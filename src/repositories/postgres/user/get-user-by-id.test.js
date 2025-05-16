import { PostgresGetUserByIdRepository } from './get-user-by-id'
import { user } from './../../../tests/index.js'
import { prisma } from '../../../../prisma/prisma'

describe('Get User By Id', () => {
    it('should get user by ID on DB', async () => {
        const createdUser = await prisma.user.create({ data: user })

        const sut = new PostgresGetUserByIdRepository()

        const result = await sut.execute(createdUser.id)

        expect(result).toStrictEqual(user)
    })

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresGetUserByIdRepository()
        const prismaSpy = jest.spyOn(prisma.user, 'findUnique')

        await sut.execute(user.id)

        expect(prismaSpy).toHaveBeenCalledWith({ where: { id: user.id } })
    })

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresGetUserByIdRepository()
        jest.spyOn(prisma.user, 'findUnique').mockRejectedValueOnce(new Error())

        const promise = sut.execute(user.id)

        expect(promise).rejects.toThrow()
    })
})
