import crypto from 'crypto';
import { createHash } from 'crypto';
import readline from 'readline';

export default class HashCrypto {
    constructor() {}

    static hashPassword(password: string): { salt: string; hashedPassword: string } {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = createHash('sha256');
        hash.update(password + salt);
        const hashedPassword = hash.digest('hex');
        return { salt, hashedPassword };
    }
    static comparePassword(password: string, salt: string, hashedPassword: string): boolean {
        const hash = createHash('sha256');
        hash.update(password + salt);
        return hash.digest('hex') === hashedPassword;
    }
}