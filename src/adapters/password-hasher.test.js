import { faker } from '@faker-js/faker'
import { PasswordHasherAdapter } from './password-hasher'

describe('Password Hasher Adapter', () => {
    it('should return a hashed password', async () => {
        const sut = new PasswordHasherAdapter()
        const password = faker.internet.password()

        const hashedPassword = sut.execute(password)

        expect(hashedPassword).toBeTruthy()
        expect(hashedPassword).not.toBe(password)
    })
})
