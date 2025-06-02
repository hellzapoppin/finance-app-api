export class EmailAlreadyInUseError extends Error {
    constructor(email) {
        super(`Email ${email} already in use`)
        this.name = 'EmailAlreadyInUseError'
    }
}

export class UserNotFoundError extends Error {
    constructor(userId) {
        super(`User with ID ${userId} not found`)
        this.name = 'UserNotFoundError'
    }
}

export class InvalidPasswordError extends Error {
    constructor() {
        super('Invalid password')
        this.name = 'InvalidPasswordError'
    }
}

export class ForbiddenError extends Error {
    constructor() {
        super('Forbidden')
        this.name = 'ForbiddenError'
    }
}
