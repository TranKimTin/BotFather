import { UserTokenInfo } from '../../common/Interface';
import * as User from '../business/User';

export async function Login(req: any, res: any) {
    try {
        const { email, password } = req.body;
        const data = await User.login(email, password);

        res.json({ code: 200, message: "ok", data });
    }
    catch (err: any) {
        console.error(err);
        res.json({ code: 402, message: err, data: [] });
    }
}

export async function Logout(req: any, res: any) {
    try {
        const token = req.headers["x-access-token"] || req.query['x-access-token'];
        await User.logout(token);
        res.json({ code: 200, message: "ok", data: [] });
    }
    catch (err: any) {
        console.error(err);
        res.json({ code: 402, message: err, data: [] });
    }
}

export async function requireToken(req: any, res: any, next: any) {
    try {
        const token = req.headers["x-access-token"] || req.query['x-access-token'];
        const user = await User.requireToken(token);
        req.user = user;
        next();
    } catch (error: any) {
        console.error(error);
        res.json({ code: 401, message: error, data: [] });
    }
}

export async function getBalance(req: any, res: any) {
    try {
        const userData: UserTokenInfo = req.user;
        const data = await User.getBalance(userData);
        res.json({ code: 200, message: "ok", data });
    } catch (error: any) {
        console.error(error);
        res.json({ code: 401, message: error, data: [] });
    }
}