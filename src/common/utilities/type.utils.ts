
export class TypeUtils {

    static hasProperty = (obj, prop): boolean => {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    };

    static isObject = (obj) => {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    static isUrl = (str): boolean => {
        if (!str) {
            return false;
        }
        try {
            new URL(str);
            return true;
        } catch (err) {
            return false;
        }
    };

    static isAlpha = (c): boolean => {
        const alphas = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return alphas.indexOf(c) !== -1;
    };

    static isAlphaVowel = (c): boolean => {
        const alphas = 'aeiouAEIOU';
        return alphas.indexOf(c) !== -1;
    };

    static isDigit = (c): boolean => {
        const digits = '0123456789';
        return digits.indexOf(c) !== -1;
    };

    static isAlphaNum = (c): boolean => {
        return this.isAlpha(c) || this.isDigit(c);
    };

    static hasAlpha = (str: string): boolean => {
        for (const c of str) {
            if (this.isAlpha(c)) {
                return true;
            }
        }
        return false;
    };

    static getDigitsOnly = (str: string): string => {
        let temp = '';
        if (!str) {
            return temp;
        }
        for (let x = 0; x < str.length; x++) {
            const c = str.charAt(x);
            if (this.isDigit(c)) {
                temp += c;
            }
        }
        return temp;
    };

    static checkAndGetString = (val: any): string | null => {
        if (typeof val === null || typeof val === undefined || typeof val !== 'string') {
            return null;
        }
        return val;
    };

    static isString = (val: any): boolean => {
        if (typeof val === null || typeof val === undefined || typeof val !== 'string') {
            return false;
        }
        return true;
    };

    static checkAndGetNumber = (val: any): number => {
        if (val === null || typeof val === 'undefined' || typeof val !== 'number') {
            return null;
        }
        return val;
    };

    static isNumber = (val: any): boolean => {
        if (val === null || typeof val === 'undefined' || typeof val !== 'number') {
            return false;
        }
        return true;
    };

    public static isEmptyObject = (obj): boolean => {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    };

    public static getValueForEitherKeys = (obj: any, keys: string[]): string => {
        const existingKeys = Object.keys(obj);
        for (var key of keys) {
            var found = existingKeys.includes(key);
            if (found) {
                return obj[key];
            }
        }
        return null;
    };

    static removeArrayDuplicates = <T>(array: T[]): T[] => {
        const unique = array.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
        return unique;
    };

    static areOverlappingRanges = (
        firstStart: number,
        firstEnd: number,
        secondStart: number,
        secondEnd: number
    ): boolean => {
        if (
            (firstStart <= secondStart && secondStart >= firstEnd) ||
            (firstStart <= secondEnd && secondEnd >= firstEnd) ||
            (secondStart <= firstStart && firstStart >= secondEnd) ||
            (secondStart <= firstEnd && firstEnd >= secondEnd)
        ) {
            return true;
        }
        return false;
    };

}
