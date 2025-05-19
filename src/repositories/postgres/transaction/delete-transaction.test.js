import dayjs from 'dayjs'
import { prisma } from '../../../../prisma/prisma'
import { transaction, user } from '../../../tests/index.js'
import { PostgresDeleteTransactionRepository } from './delete-transaction.js'

describe('Postgress Delete Transaction Repository', () => {
    it('should delete a transaction successfully', async () => {
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })
        const sut = new PostgresDeleteTransactionRepository()

        const result = await sut.execute(transaction.id)

        expect(result.name).toBe(transaction.name)
        expect(result.user_id).toBe(user.id)
        expect(String(result.amount)).toBe(String(transaction.amount))
        expect(result.type).toBe(transaction.type)
        expect(dayjs(result.date).daysInMonth()).toBe(
            dayjs(transaction.date).daysInMonth(),
        )
        expect(dayjs(result.date).month()).toBe(dayjs(transaction.date).month())
        expect(dayjs(result.date).year()).toBe(dayjs(transaction.date).year())
    })

    it('should call Prisma with correct params', async () => {
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })
        const sut = new PostgresDeleteTransactionRepository()
        const prismaSpy = jest.spyOn(prisma.transaction, 'delete')

        await sut.execute(transaction.id)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: { id: transaction.id },
        })
    })

    it('should throw generic error if Prisma throws generic error', async () => {
        const sut = new PostgresDeleteTransactionRepository()
        jest.spyOn(prisma.transaction, 'delete').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(transaction.id)

        expect(promise).rejects.toThrow()
    })
})
