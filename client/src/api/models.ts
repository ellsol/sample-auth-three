export type UserTokenRole = {
    id: string
    role: string
    audiences: Array<string>
}

export type Token = {
    token: string
    refreshToken: string
    expiresIn: number
    type: string
}

export enum Role {
    ADMIN = "admin",
    BASIC = "basic"
}

export type MeResponse = {
    id: string
    role: string
}



