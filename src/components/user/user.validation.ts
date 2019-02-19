import { celebrate, Joi } from 'celebrate';
import joiObjectid from 'joi-objectid';

// Extend joi with objectId
Joi.objectId = joiObjectid(Joi);

export const getUserValidator = celebrate({
  params: {
    id: Joi.objectId().required(),
  },
});

export const deleteUserValidator = getUserValidator;

export const createUserValidator = celebrate({
  body: {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    location: Joi.object().keys({
      lat: Joi.number()
        .min(-90)
        .max(90)
        .required(),
      lng: Joi.number()
        .min(-180)
        .max(180)
        .required(),
      name: Joi.string().required(),
    }),
  },
});

export const updateUserValidator = celebrate({
  body: {
    firstName: Joi.string(),
    lastName: Joi.string(),
    location: Joi.object()
      .keys({
        lat: Joi.number()
          .min(-90)
          .max(90),
        lng: Joi.number()
          .min(-180)
          .max(180),
        name: Joi.string(),
      })
      .and('lat', 'lng', 'name'),
  },
});
