const stripNoSQLInjection = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(stripNoSQLInjection);

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    // Remove keys starting with $ or containing .
    const cleanKey = key.replace(/^\$/, '').replace(/\./g, '');
    sanitized[cleanKey] = stripNoSQLInjection(value);
  }
  return sanitized;
};

export const sanitize = (req, res, next) => {
  if (req.body) {
    req.body = stripNoSQLInjection(req.body);
  }
  if (req.query) {
    Object.defineProperty(req, 'query', {
      value: stripNoSQLInjection({ ...req.query }),
      writable: true,
      configurable: true,
    });
  }
  if (req.params) {
    Object.defineProperty(req, 'params', {
      value: stripNoSQLInjection({ ...req.params }),
      writable: true,
      configurable: true,
    });
  }
  next();
};
