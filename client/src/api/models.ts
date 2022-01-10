export type UserTokenRole = {
    id: string
    role: string
    audiences: Array<string>
}

export type TokenRequest =
    {
        audiences: [
            string
        ],
        message: string,
        originalAppSignature: string,
        signature: string,
        signaturePrefix: true,
        userERC725Address: string
    }

export type Token = {
    token: string
    refreshToken: string
    expiresIn: number
    type: string
}

export type SignMessageResponse = {
    address: string,
    appERC725Address: string,
    message: string,
    signature: string,
    signaturePrefix: true,
}

export enum Role {
    ADMIN = "admin",
    BASIC = "basic"
}

export type MeResponse = {
    erc725ControllerKey: string
    erc725Address: string
}



