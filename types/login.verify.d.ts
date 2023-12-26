export type LoginVerifyPayload = {
    authObject: AuthObject,
    client: string
}

export type AuthObject = {
    token: string,
    user: {
        _id: string,
        username: string,
        role: {
            _id: string,
            roleName: string
        },
        bio: string
    }
}