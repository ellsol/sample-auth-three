export type Environment = {
    ipServiceURL: string;
    apiBaseURL: string;
    audience: string;
};

export const getEnvironment = (): Environment => {
    return {
        ipServiceURL: process.env.ISSUER_BASE_URL || '',
        apiBaseURL: process.env.AUDIENCE || '',
        audience: process.env.AUDIENCE || '',
    }
};

