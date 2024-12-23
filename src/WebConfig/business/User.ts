import * as mysql from '../lib/mysql';
import dotenv from 'dotenv';
import md5 from 'md5';
import jwt from 'jsonwebtoken';

dotenv.config({ path: `${__dirname}/../../../.env` });

export async function login(email: string, password: string) {
    const user = await mysql.query(`SELECT id, email, password, balance FROM User WHERE email = ?`,
        [email]);

    let userID = 0;

    if (user.length === 0) {
        const u = await mysql.query(`INSERT INTO User(email, password) VALUES(?,?)`,
            [email, md5(`${email.toLowerCase()}_${password}`)]
        );
        userID = u.insertId;
    }
    else {
        if (user[0].password !== md5(`${email.toLowerCase()}_${password}`)) throw 'Sai mật khẩu';
        userID = user[0].id;
    }

    const userData = {
        id: userID,
        email
    };

    const secretKey = process.env.JWT_SECRET_KEY as jwt.Secret;
    const algorithm = process.env.JWT_ALGORITHM as jwt.Algorithm;

    const token = jwt.sign(userData, secretKey, { algorithm, expiresIn: '7d' });

    await mysql.query(`INSERT INTO AccessToken(userID, token) VALUES(?, ?)`, [userID, token]);

    return { token };
}

export async function logout(token: string) {
    await mysql.query('DELETE FROM AccessToken WHERE Token = ?', [token]);
}

export async function requireToken(token: string) {
    try {
        let [{ count }] = await mysql.query(`SELECT count(1) AS count FROM AccessToken WHERE token = ? limit 1`, [token]);
        if (count > 0) {
            const secretKey = process.env.JWT_SECRET_KEY as jwt.Secret;

            let user = jwt.verify(token, secretKey);
            return user;
        }
        else {
            throw 'Token không hợp lệ';
        }
    }
    catch (err) {
        console.error(err);
        await mysql.query(`DELETE FROM AccessToken WHERE token = ?`, [token]);
        throw 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại';
    }
}