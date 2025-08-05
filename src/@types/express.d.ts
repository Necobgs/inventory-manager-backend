import { User } from '../user/entities/user.entity'; // Ajuste o caminho para sua entidade User

declare module 'express-serve-static-core' {
  interface Request {
    user?: User; // Ou o tipo que representa o usuário no token JWT
  }
}