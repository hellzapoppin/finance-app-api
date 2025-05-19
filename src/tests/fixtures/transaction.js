import { faker } from '@faker-js/faker'
import { TransactionType } from '@prisma/client'

export const transaction = {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    name: faker.book.title(),
    date: faker.date.anytime().toISOString(),
    amount: Number(faker.finance.amount()),
    type: faker.helpers.arrayElement([
        TransactionType.EARNING,
        TransactionType.EXPENSE,
        TransactionType.INVESTMENT,
    ]),
}
