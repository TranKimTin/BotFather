import * as User from '../business/User';

export async function Login(req: any, res: any) {
    try {
        const { email, password } = req.body;
        const data = await User.login(email, password);

        res.json({ code: 200, message: "ok", data });
    }
    catch (err: any) {
        console.error(err);
        res.json({ code: 400, message: err, data: [] });
    }
}
