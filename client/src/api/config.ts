export type Environment = {
    ipServiceURL: string;
    apiBaseURL: string;
    audience: string;
};

const devEnvironment = {
    ipServiceURL: 'https://dev.auth-three.com',
    apiBaseURL: 'http://localhost:8001',
    audience: 'http://localhost:8001',
}

export const getEnvironment = (): Environment => {
    const env =  devEnvironment
    console.log(env)
    return env
};

