import { UserTokenInfo } from '../../common/Interface';
import * as Dashboard from '../business/Dashboard';

export async function statistic(req: any, res: any) {
    try {
        const userData: UserTokenInfo = req.user;

        const data = await Dashboard.getBotInfo(userData);

        res.json({ code: 200, message: "ok", data });
    }
    catch (err: any) {
        console.error(err);
        res.json({ code: 400, message: err, data: [] });
    }
}