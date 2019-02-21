import joiObjectid from '@wegolook/joi-objectid';
import { celebrate, Joi } from 'celebrate';

// Extend joi with objectId
const myJoi = Joi.extend(joiObjectid);

export const getUserValidator = celebrate({
  params: {
    id: myJoi.objectId().required(),
  },
});

export const deleteUserValidator = getUserValidator;

export const getUsersValidator = celebrate({
  query: Joi.object()
    .keys({
      lat: Joi.number()
        .min(-90)
        .max(90),
      limit: Joi.number().required(),
      lng: Joi.number()
        .min(-180)
        .max(180),
      offset: Joi.number().required(),
      sort: Joi.string().valid('location'),
    })
    .and('lat', 'lng', 'sort')
    .unknown(true),
});

export const createUserValidator = celebrate({
  body: {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    location: Joi.object().keys({
      coordinates: Joi.array().items(
        Joi.number()
          .min(-90)
          .max(90)
          .required(),
        Joi.number()
          .min(-180)
          .max(180)
          .required(),
      ),
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
        coordinates: Joi.array().items(
          Joi.number()
            .min(-90)
            .max(90),
          Joi.number()
            .min(-180)
            .max(180),
        ),
        name: Joi.string(),
      })
      .and('coordinates', 'name'),
  },
});
