import { ValidationError } from '../errors/ValidationError.js';

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    const errors = (result.error.issues || result.error.errors || []).map((err) => ({
      path: err.path.join('.'),
      message: err.message,
    }));
    throw new ValidationError(errors);
  }

  req.validated = result.data;
  next();
};