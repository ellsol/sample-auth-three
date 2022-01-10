import {Environment} from "./config";
import axios, {AxiosRequestConfig} from "axios";
import {TokenStore} from "./token_store";
import {SignMessageResponse, Token, UserTokenRole} from "./models";
import {addLogger, validateRequestStatusCode} from "./axios_helper";


export interface Authenticator {
    refreshToken(refreshToken: string): Promise<Token>

    getToken(): Token | undefined

    addAuthHeader(config: AxiosRequestConfig): any
}

export class IPClient implements Authenticator {

    /*
        client that targets public api
    */
    ipClient = addLogger(axios.create({
        validateStatus: validateRequestStatusCode,
        baseURL: this.env.ipServiceURL,
        headers: {'Content-Type': 'application/json'}
    }), this.shouldLog);

    constructor(private env: Environment, private tokenStore: TokenStore, private shouldLog: boolean) {
    }

    async signMessage(appERC725Address: string, message: string, signaturePrefix: boolean): Promise<SignMessageResponse> {
        return await this.ipClient.post('/api/v1/up/sign', {
            appERC725Address: appERC725Address,
            message: message,
            signaturePrefix: signaturePrefix
        }).then(response => {
            return response.data
        });
    }

    /*
        requestToken

        signs in a user by providing
        email
        password
        audiences   - the resource services that will receive the token
    */
    async requestToken(message: string, originalAppSignature: string, clientSignature: string, userERC725Address: string, signaturePrefix: boolean, audiences: Array<String>): Promise<Token> {
        return await this.ipClient.post('/api/v1/up/token', {
            message: message,
            originalAppSignature: originalAppSignature,
            signature: clientSignature,
            signaturePrefix: true,
            userERC725Address: userERC725Address,
            audiences: audiences
        }).then(response => {
            const token = response.data
            this.tokenStore.setToken(token)
            return token
        });
    }

    /*
        refreshToken

        refreshes the token with refreshToken when token has expired
    */
    async refreshToken(refreshToken: string): Promise<Token> {
        return await this.ipClient.post('/api/v1/up/token/refresh', {
            refreshToken: refreshToken,
        }).then(response => {
            const token = response.data
            this.tokenStore.setToken(token)
            return token
        });
    }

    /*
        verify

        receives the userId, role =[admin, basic], audiences in exchange for a token
    */
    async verify(token: string): Promise<UserTokenRole> {
        return await this.ipClient.post('/api/v1/auth/token/verify', {
            token: token
        }).then(response => {
            return response.data
        });
    }

    getToken(): Token | undefined {
        return this.tokenStore.getToken()
    }

    /*
        adding an authorisation header with token
    */
    addAuthHeader = (config: AxiosRequestConfig) => {
        let token = this.tokenStore.getToken()
        if (token) {
            // @ts-ignore
            config.headers['Authorization'] = 'Bearer ' + token.token;
        }
    }

    clearToken() {
        this.tokenStore.clearToken()
    }
}