import express, { Application } from 'express';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import Controller from '@/utils/interfaces/controller.interface';
import ErrorMiddleware from '@/middleware/error.middleware';
import helmet from 'helmet';
import  PointModel  from '@/resources/point/point.model';
import EntityModel from '@/resources/entity/entity.model';
import DamageModel from '@/resources/damage/damage.model';
import { databaseConnection } from '@/configs/connection.config';

class App {
    public express: Application;
    public port: number;
    public sequelize: any;
    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;
        this.initialiseDatabaseConnection();
        this.initialiseMiddleware();
        this.initialiseControllers(controllers);
        this.initialiseErrorHandling();
    }

    private initialiseMiddleware(): void {
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(morgan('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(compression());
    }

    private initialiseControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller) => {
            this.express.use('/api', controller.router);
        });
    }

    private initialiseErrorHandling(): void {
        this.express.use(ErrorMiddleware);
    }

    private async initialiseDatabaseConnection(): Promise<void> {
        this.sequelize = databaseConnection(PointModel, EntityModel, DamageModel);
        await this.sequelize.authenticate();
        await this.sequelize.sync({ alter: true });
    }

    public listen(): void {
        this.express.listen(this.port, () => {
            console.log(`App listening on port ${this.port}`);
        });
    }

    public close(): void {
        this.express.on('close', () => {
            this.sequelize.close();
          });
    }
}

export default App;
