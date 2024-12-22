import * as util from '../../common/util'
import * as mysql from '../lib/mysql';
import moment from 'moment';
import dotenv from 'dotenv';
import axios from 'axios';
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
        console.log(user[0].password);
        console.log(md5(`${email.toLowerCase()}_${password}`));

        if (user[0].password !== md5(`${email.toLowerCase()}_${password}`)) throw 'Sai mật khẩu';
        userID = user[0].id;
    }

    const userData = {
        id: userID,
        email
    };

    const secretKey = process.env.JWT_SECRET_KEY as jwt.Secret;
    const algorithm = process.env.JWT_ALGORITHM as jwt.Algorithm;
    console.log({secretKey, algorithm})

    const token = jwt.sign(userData, secretKey, { algorithm, expiresIn: '7d' });

    await mysql.query(`INSERT INTO AccessToken(userID, token) VALUES(?, ?)`, [userID, token]);

    return { token };
}