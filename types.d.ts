
declare namespace Express {
  interface Request {
    user?: Omit<import('@prisma/client').User, 'password', 'refreshToken', 'createdAt'> | null;
  }
}