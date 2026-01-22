export interface User extends Document {
  username: string;
  email: string;
  hashPassword: string;
  authenticate: (password: string) => boolean;
}
