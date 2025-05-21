import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma'
import { transaction, user } from '../../../tests/index.js'
import { PostgresUpdateTransactionRepository } from './update-transaction.js'
import { TransactionType } from '@prisma/client'
import dayjs from 'dayjs'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { transactionNotFoundResponse } from '../../../controllers/helpers/transaction.js'

describe('Postgres Update Transaction Repository', () => {
    const updateTransactionParams = {
        name: faker.book.title(),
        date: faker.date.anytime().toISOString(),
        amount: Number(faker.finance.amount()),
        type: faker.helpers.arrayElement([
            TransactionType.EARNING,
            TransactionType.EXPENSE,
            TransactionType.INVESTMENT,
        ]),
    }
    it('should update a transacion on DB successfully', async () => {
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })
        const sut = new PostgresUpdateTransactionRepository()

        const result = await sut.execute(
            transaction.id,
            updateTransactionParams,
        )

        expect(result.id).toBe(transaction.id)
        expect(result.name).toBe(updateTransactionParams.name)
        expect(result.user_id).toBe(user.id)
        expect(String(result.amount)).toBe(
            String(updateTransactionParams.amount),
        )
        expect(result.type).toBe(updateTransactionParams.type)
        expect(dayjs(result.date).daysInMonth()).toBe(
            dayjs(updateTransactionParams.date).daysInMonth(),
        )
        expect(dayjs(result.date).month()).toBe(
            dayjs(updateTransactionParams.date).month(),
        )
        expect(dayjs(result.date).year()).toBe(
            dayjs(updateTransactionParams.date).year(),
        )
    })

    it('should call Prisma with correct params', async () => {
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })
        const sut = new PostgresUpdateTransactionRepository()
        const prismaSpy = jest.spyOn(prisma.transaction, 'update')

        await sut.execute(transaction.id, { ...transaction, user_id: user.id })

        expect(prismaSpy).toHaveBeenCalledWith({
            where: { id: transaction.id },
            data: { ...transaction, user_id: user.id },
        })
    })

    it('should throws if Prisma throws', async () => {
        const sut = new PostgresUpdateTransactionRepository()
        jest.spyOn(prisma.transaction, 'update').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(transaction.id, transaction)

        expect(promise).rejects.toThrow()
    })

    it('should throw TransactionNotFoundError if Prisma does not find record to update', () => {
        const sut = PostgresUpdateTransactionRepository()
        jest.spyOn(prisma.transaction, 'update').mockRejectedValueOnce(
            new PrismaClientKnownRequestError('', { code: 'P2025' }),
        )

        const promise = sut.execute(transaction.id, transaction)

        expect(promise).rejects.toThrow(
            new transactionNotFoundResponse(transaction.id),
        )
    })
})
