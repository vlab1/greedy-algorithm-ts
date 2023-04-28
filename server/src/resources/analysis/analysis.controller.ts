import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/analysis/analysis.validation';
import AnalysisService from '@/resources/analysis/analysis.service';

class AnalysisController implements Controller {
    public path = '/analysis';
    public router = Router();
    private AnalysisService = new AnalysisService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/start`,
            validationMiddleware(validate.analysis),
            this.analysis
        );
        this.router.post(
            `${this.path}/save`,
            validationMiddleware(validate.analysis),
            this.save
        );
        this.router.delete(
            `${this.path}/delete`,
            validationMiddleware(validate.delete0),
            this.delete0
        );
        this.router.post(
            `${this.path}/greedy-algorithm`,
            validationMiddleware(validate.greedyAlgorithm),
            this.greedyAlgorithm
        );
        this.router.get(`${this.path}/find`, this.find);
    }

    private analysis = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const {
                columns,
                rows,
                data,
                columns_N,
                columns_S,
                columns_y,
                rows_H,
                rows_L,
                rows_z,
            } = req.body;

            const analysis = await this.AnalysisService.analysis(
                columns,
                rows,
                data,
                columns_N,
                columns_S,
                columns_y,
                rows_H,
                rows_L,
                rows_z
            );

            res.status(201).json({ data: analysis });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private save = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const {        columns,
                rows,
                data,
                columns_N,
                columns_S,
                columns_y,
                rows_H,
                rows_L,
                rows_z } = req.body;

            const analysis = await this.AnalysisService.save(
                columns,
                rows,
                data,
                columns_N,
                columns_S,
                columns_y,
                rows_H,
                rows_L,
                rows_z
            );

            res.status(201).json({ data: analysis });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private delete0 = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { columns, rows, data } = req.body;

            const analysis = await this.AnalysisService.delete0(
                columns,
                rows,
                data
            );

            res.status(201).json({ data: analysis });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private find = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const analysis = await this.AnalysisService.find();
            
            res.status(201).json({ data: analysis });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private greedyAlgorithm = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const {
                columns,
                rows,
                data,
                columns_N,
                columns_S,
                columns_y,
                rows_H,
                rows_L,
                rows_z,
            } = req.body;

            const greedyAlgorithm = await this.AnalysisService.greedyAlgorithm(
                columns,
                rows,
                data,
                columns_N,
                columns_S,
                columns_y,
                rows_H,
                rows_L,
                rows_z
            );

            res.status(201).json({ data: greedyAlgorithm });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
}

export default AnalysisController;