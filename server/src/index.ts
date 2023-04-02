import 'dotenv/config';
import 'module-alias/register';
import validateEnv from '@/utils/validateEnv';
import App from './app';
import AnalysisController from '@/resources/analysis/analysis.controller';

validateEnv();

const app = new App(
    [
        new AnalysisController()
    ],
    Number(process.env.PORT)
);

app.listen();
app.close();