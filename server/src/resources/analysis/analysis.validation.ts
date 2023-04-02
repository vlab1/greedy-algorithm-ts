import Joi from 'joi';

const analysis = Joi.object({
    columns:  Joi.array().items(Joi.string()).required(),
    rows:  Joi.array().items(Joi.string()).required(),
    income: Joi.array().items(Joi.array().items(Joi.number())).required(),
    rowConstraint:  Joi.array().items(Joi.number()).required(),
    colConstraint:  Joi.array().items(Joi.number()).required(),
    efficiency:  Joi.array().items(Joi.number()).required(),
});

export default {
    analysis 
};
