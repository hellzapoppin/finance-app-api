import { CreateUserController } from './create-user'

describe('Create User Controller', () => {
    class CreateUserUseCaseStub {
        execute(user) {
            return user
        }
    }
    it('should return 201 when creating an user successfully', async () => {
        // arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                first_name: 'José',
                last_name: 'Leonardo',
                email: 'joseleonardo85@gmail.com',
                password: '123456',
            },
        }

        //act
        const result = await createUserController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(201)
        expect(result.body).toBe(httpRequest.body)
    })

    it('should return 400 is first_name is not provided', async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                last_name: 'Leonardo',
                email: 'joseleonardo85@gmail.com',
                password: '123456',
            },
        }

        //act
        const result = await createUserController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(400)
    })
})
