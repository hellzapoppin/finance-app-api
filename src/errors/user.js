export class EmailAlreadyInUseError extends Error {
    constructor(email) {
        super(`Email ${email} already in use`)
        this.name = 'EmailAlreadyInUseError'
    }
}
