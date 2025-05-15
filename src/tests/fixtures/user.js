import { faker } from '@faker-js/faker'

export const user = {
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 7 }),
}

export const userBalance = {
    earnings: Number(faker.finance.amount()),
    expenses: Number(faker.finance.amount()),
    investments: Number(faker.finance.amount()),
    balance: Number(faker.finance.amount()),
}
