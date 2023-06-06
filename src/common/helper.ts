import child_process from 'child_process';
import { Gender } from '../domain.types/miscellaneous/system.types';
import Countries from './miscellaneous/country.codes';
import { TypeUtils } from './utilities/type.utils';
import mime = require('mime-types');

////////////////////////////////////////////////////////////////////////

export class Helper {

    static executeCommand = (command: string): Promise<string> => {
        return new Promise(function (resolve, reject) {
            child_process.exec(
                command,
                function (error: Error, standardOutput: string, standardError: string) {
                    if (error) {
                        reject();
                        return;
                    }
                    if (standardError) {
                        reject(standardError);
                        return;
                    }
                    resolve(standardOutput);
                }
            );
        });
    };

    static getSessionHeaders = (token: string) => {
        return {
            'Content-Type'    : 'application/json; charset=utf-8',
            Accept            : '*/*',
            'Cache-Control'   : 'no-cache',
            'Accept-Encoding' : 'gzip, deflate, br',
            Connection        : 'keep-alive',
            Authorization     : 'Bearer ' + token,
        };
    };

    static getNeedleOptions = (headers: any) => {
        return {
            headers    : headers,
            compressed : true,
            json       : true,
        };
    };

    static guessPrefixByGender = (gender: Gender) => {
        if (gender === Gender.Male) {
            return 'Mr.';
        }
        if (gender === Gender.Female) {
            return 'Miss.';
        }
        return ''; //Return empty prefix
    };

    static getFullName = (
        prefix: string | null,
        firstName: string | null,
        lastName: string | null
    ): string => {
        var prefix = TypeUtils.checkAndGetString(prefix) ? prefix + ' ' : '';
        var firstName = TypeUtils.checkAndGetString(firstName) ? firstName + ' ' : '';
        var lastName = TypeUtils.isString(lastName) ? lastName : '';
        let displayName: string = prefix + firstName + lastName;
        displayName = displayName.trim();
        if (displayName.length === 0) {
            displayName = 'unknown';
        }
        return displayName;
    };

    static trySanitizePhoneNumber = (phone: string): string => {
        if (!phone) {
            return phone;
        }
        if (phone.includes('-')) {
            const tokens = phone.split('-');
            let countryCode = tokens[0];
            let phoneNumber = tokens.length > 2 ? tokens.slice(1, ).join() : tokens[1];
            countryCode = '+' + TypeUtils.getDigitsOnly(countryCode);
            phoneNumber = TypeUtils.getDigitsOnly(phoneNumber);
            return countryCode + '-' + phoneNumber;
        }
        else if (phone.startsWith('+')) {
            var countryCodes = Countries.map(x => x.PhoneCode);
            var countryCodesSorted = countryCodes.sort((a,b) => b.length - a.length);
            for (var cc of countryCodesSorted) {
                if (phone.startsWith(cc)) {
                    var phoneNumber = phone.substring(cc.length);
                    phoneNumber = TypeUtils.getDigitsOnly(phoneNumber);
                    return cc + '-' + phoneNumber;
                }
            }
        }
        return phone;
    };

    static validatePhone = (phone: string) => {
        const tokens = phone.split('-');
        const countryCode = tokens[0];
        const phoneNumber = tokens[1];
        const validCountryCode = TypeUtils.isString(countryCode) && countryCode.length > 0;
        if (!validCountryCode) {
            return Promise.reject('Invalid country code');
        }
        const validPhoneNumber = TypeUtils.isString(phoneNumber) && phoneNumber.length >= 9;
        if (!validPhoneNumber) {

            //throw new InputValidationError(['Invalid phone number']);
            return Promise.reject('Invalid phone number');
        }
        return Promise.resolve();
    };

    // public static sleep = (miliseconds) => {
    //     return new Promise((resolve) => {
    //         setTimeout(resolve, miliseconds);
    //     });
    // };

    public static getPossiblePhoneNumbers = (phone) => {

        if (phone == null) {
            return [];
        }

        let phoneTemp = phone;
        phoneTemp = phoneTemp.trim();
        const countryCodes = Countries.map(x => x.PhoneCode);
        const searchFors = countryCodes;
        const possiblePhoneNumbers = [phone];

        let phonePrefix = "";

        for (var s of searchFors) {
            if (phoneTemp.startsWith(s)) {
                phonePrefix = s;
                phoneTemp = phoneTemp.replace(s, '');
                phoneTemp = phoneTemp.replace('-', '');
            }
        }

        if (phonePrefix) {
            possiblePhoneNumbers.push(phonePrefix + phoneTemp);
            possiblePhoneNumbers.push(phonePrefix + "-" + phoneTemp);
            possiblePhoneNumbers.push(phoneTemp);

        } else {

            var possibles = Countries.map(x => {
                return x.PhoneCode + phoneTemp;
            });
            possiblePhoneNumbers.push(...possibles);
            possibles = Countries.map(x => {
                return x.PhoneCode + "-" + phoneTemp;
            });
            possiblePhoneNumbers.push(...possibles);
            possiblePhoneNumbers.push(phoneTemp);
        }
        return possiblePhoneNumbers;
    };

    public static getMimeType = (pathOrExtension: string) => {
        var mimeType = mime.lookup(pathOrExtension);
        if (!mimeType) {
            mimeType = 'text/plain';
        }
        return mimeType;
    };

}
