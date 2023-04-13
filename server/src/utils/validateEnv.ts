import { cleanEnv, str, port} from 'envalid';

function validateEnv(): void {
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ['development', 'production'],
        }),
        PGUSER: str(),
        PGDATABASE: str(),
        PGPASSWORD: str(),
        PGPORT: port({ default: 5432 }),
        PGHOST: str(),
        PORT: port({ default: 5000 }),
        JWT_SECRET: str(),
    });
}

export default validateEnv;
