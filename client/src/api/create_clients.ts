import {Environment, getEnvironment} from "./config";
import {IPClient} from "./ip_client";
import {MemoryTokenStore} from "./token_store";
import {ApiClient} from "./api_client";


export const createTestClients = (env: Environment, shouldLog: boolean): [ApiClient, IPClient] => {
    const ipClient = new IPClient(env, new MemoryTokenStore(), shouldLog)
    const apiClient = new ApiClient(env, ipClient, shouldLog)

    return [apiClient, ipClient]
}

export const clients = createTestClients(getEnvironment(), true)