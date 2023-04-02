import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/analysis/analysis.validation';
import AnalysisService from '@/resources/analysis/analysis.service';
import { TowerDefenceInput } from '@/resources/analysis/analysis.interface';

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
    }

    private analysis = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { columns, rows, income, rowConstraint, colConstraint, efficiency } =
                req.body;

            const analysis = await this.AnalysisService.analysis({
                columns,
                rows,
                income,
                rowConstraint,
                colConstraint,
                efficiency
            });

            res.status(201).json({ data: analysis });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
}

export default AnalysisController;
