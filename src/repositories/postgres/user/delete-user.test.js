import { prisma } from '../../../../prisma/prisma.js'
import { user } from '../../../tests/index.js'
import { PostgresDeleteUserRepository } from './delete-user.js'

describe('Delete User Repository', () => {
    it('should delete an user successfully', async () => {
        await prisma.user.create({ data: user })

        const sut = new PostgresDeleteUserRepository()

        const result = await sut.execute(user.id)

        expect(result).toStrictEqual(user)
    })

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresDeleteUserRepository()
        const prismaSpy = jest.spyOn(prisma.user, 'delete')

        await sut.execute(user.id)

        expect(prismaSpy).toHaveBeenLastCalledWith({ where: { id: user.id } })
    })
})
