import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import * as crypto from 'crypto';
import genpass from 'generate-password';

////////////////////////////////////////////////////////////////////////

export class StringUtils {

    static compareHashedPassword = (password: string, hash: string): boolean => {
        if (!password) {
            return false;
        }
        return compareSync(password.toString(), hash);
    };

    static generateHashedPassword = (password: string): string => {
        if (!password) {
            return null;
        }
        return hashSync(password.toString(), 10);
    };

    static generateCryptoToken = async (): Promise<string> => {
        const { randomBytes } = await import('crypto');
        const buffer = randomBytes(30);
        return buffer.toString('hex');
    };

    static generateUserName = (): string => {
        return genpass.generate({
            length    : 8,
            numbers   : false,
            lowercase : true,
            uppercase : false,
            symbols   : false
        });
    };

    static generatePassword = (): string => {
        const password = genpass.generate({
            length    : 8,
            numbers   : true,
            lowercase : true,
            uppercase : true,
            symbols   : true,
        });
        return password;
    };

    public static encodeToBase64 = (str: string) => {
        const buffer = Buffer.from(str, 'utf-8');
        return buffer.toString('base64');
    };

    public static decodeFromBase64 = (str: string) => {
        const buffer = Buffer.from(str, 'base64');
        return buffer.toString('utf-8');
    };

    public static hash = (str: string) => {
        const salt = genSaltSync(8);
        const hashed = hashSync(str, salt);
        return hashed;
    };

    public static compare = (str: string, hashed: string) => {
        return compareSync(str, hashed);
    };

    static areStringsOverlapping = (firstStr: string, secondStr: string) => {
        if (firstStr.indexOf(secondStr) !== -1 || secondStr.indexOf(firstStr) !== -1) {
            return true;
        }
        return false;
    };

    public static generateDisplayCode_RandomNumbers = (prefix = null) => {
        var tmp = (Math.floor(Math.random() * 9000000000) + 1000000000).toString();
        var displayId = tmp.slice(0, 4) + '-' + tmp.slice(4, 8);
        var identifier = displayId;
        if (prefix != null){
            identifier = prefix + '-' + identifier;
        }
        return identifier;
    };

    public static generateDisplayCode_RandomChars = (prefix = null) => {
        const code = genpass.generate({
            length    : 24,
            numbers   : true,
            lowercase : true,
            uppercase : false,
            symbols   : false,
        });
        return prefix ? prefix + '#' + code : code;
    };

    public static convertCamelCaseToPascalCase = (str: string): string => {
        if (str.length > 0) {
            return str.charAt(0).toUpperCase() + str.substring(1);
        }
        return str;
    };

    public static isUpperCase = (str): boolean => {
        return str.toUpperCase() === str;
    };

    public static convertPascalCaseToCapitalSnakeCase = (str: string): string => {
        if (str.length > 0) {
            var outstr = "";
            for (var i = 0; i < str.length; i++) {
                var c = str.charAt(i);
                if (this.isUpperCase(c) && i !== 0) {
                    outstr += '_' + c.toUpperCase();
                }
                else {
                    outstr += c.toUpperCase();
                }
            }
            return outstr;
        }
        return str;
    };

    //Reference: https://github.com/zishon89us/node-cheat/blob/master/stackoverflow_answers/crypto-create-cipheriv.js#L2

    public static encrypt = (str: string) => {
        const algorithm = 'aes-256-ctr';
        const LENGTH = 16;
        const iv = crypto.randomBytes(LENGTH);
        const cipher = crypto.createCipheriv(algorithm, Buffer.from(process.env.CIPHER_SALT, 'hex'), iv);
        let encrypted = cipher.update(str);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    };

    public static decrypt = (str: string) => {
        const algorithm = 'aes-256-ctr';
        const tokens = str.split(':');
        const iv = Buffer.from(tokens.shift(), 'hex');
        const encryptedText = Buffer.from(tokens.join(':'), 'hex');
        const decipher = crypto.createDecipheriv(algorithm, Buffer.from(process.env.CIPHER_SALT, 'hex'), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    };

}
