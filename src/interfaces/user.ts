export interface IUser extends Document {
  username: string;
  email: string;
  hashPassword: string;
  authenticate: (password: string) => boolean;
}
