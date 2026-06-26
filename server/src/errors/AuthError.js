import { AppError } from './AppError.js';

export class AuthError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
  }
}