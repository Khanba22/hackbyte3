
interface IUser{
    username: string;
    email: string;
    password?: string;
    googleId?: string;
    isPasswordSet: boolean;
    role:string;
}