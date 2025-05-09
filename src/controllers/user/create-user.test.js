import { faker } from '@faker-js/faker'
import { CreateUserController } from './create-user'
import { EmailAlreadyInUseError } from '../../errors/user'

describe('Create User Controller', () => {
    class CreateUserUseCaseStub {
        execute(user) {
            return user
        }
    }

    const makeSut = () => {
        const createUserUseCase = new CreateUserUseCaseStub()
        const sut = new CreateUserController(createUserUseCase)

        return { createUserUseCase, sut }
    }
    it('should return 201 when creating an user successfully', async () => {
        // arrange
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            },
        }

        //act
        const result = await sut.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(201)
        expect(result.body).toEqual(httpRequest.body)
    })

    it('should return 400 is first_name is not provided', async () => {
        //arrange
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            },
        }

        //act
        const result = await sut.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 is last_name is not provided', async () => {
        //arrange
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            },
        }

        //act
        const result = await sut.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is not provided', async () => {
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                password: faker.internet.password({ length: 7 }),
            },
        }

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is not valid', async () => {
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: 'invalid_email',
                password: faker.internet.password({ length: 7 }),
            },
        }

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is not provided', async () => {
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
            },
        }

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is less then 6 characters', async () => {
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 5 }),
            },
        }

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })

    it('should call CreateUserUSeCase with correct params', async () => {
        const { sut, createUserUseCase } = makeSut()

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            },
        }

        const executeSpy = jest.spyOn(createUserUseCase, 'execute')

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    it('should return 500 if CreateUserUseCase throws', async () => {
        const { sut, createUserUseCase } = makeSut()

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            },
        }

        jest.spyOn(createUserUseCase, 'execute').mockImplementationOnce(() => {
            throw new Error()
        })

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(500)
    })

    it('should return 500 if CreaterUserUseCase throws EmailAlreadyInUseError error', async () => {
        const { sut, createUserUseCase } = makeSut()

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            },
        }

        jest.spyOn(createUserUseCase, 'execute').mockImplementationOnce(() => {
            throw new EmailAlreadyInUseError(httpRequest.body.email)
        })

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })
})
