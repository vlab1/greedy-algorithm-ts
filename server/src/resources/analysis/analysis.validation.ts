import Joi from 'joi';

const analysis = Joi.object({
    columns:  Joi.array().max(8).min(1).items(Joi.string()).required(),
    columns_N: Joi.array().items(Joi.number()).required(),
    columns_S: Joi.array().items(Joi.number()).required(),
    columns_y: Joi.array().items(Joi.number()).required(),
    rows:  Joi.array().max(8).min(1).items(Joi.string()).required(),
    data: Joi.array().items(Joi.array().items(Joi.number())).required(),
    rows_H: Joi.array().items(Joi.number()).required(),
    rows_L: Joi.array().items(Joi.array().items(Joi.number())).required(),
    rows_z: Joi.array().items(Joi.number()).required(),
});

const delete0 = Joi.object({
    columns:  Joi.array().items(Joi.string().valid(null, "", '')).required(),
    rows:  Joi.array().items(Joi.string().valid(null, "", '')).required(),
    data: Joi.array().items(Joi.array().items(Joi.number().valid(0))).required(),
});

const greedyAlgorithm = Joi.object({
    columns:  Joi.array().max(8).min(1).items(Joi.string()).required(),
    columns_N: Joi.array().items(Joi.number()).required(),
    columns_S: Joi.array().items(Joi.number()).required(),
    columns_y: Joi.array().items(Joi.number()).required(),
    rows:  Joi.array().max(8).min(1).items(Joi.string()).required(),
    data: Joi.array().items(Joi.array().items(Joi.number())).required(),
    rows_H: Joi.array().items(Joi.number()).required(),
    rows_L: Joi.array().items(Joi.array().items(Joi.number())).required(),
    rows_z: Joi.array().items(Joi.number()).required(),

});


export default {
    analysis,
    delete0,
    greedyAlgorithm
};
