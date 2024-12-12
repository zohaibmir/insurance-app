/**
 * src/config/config.ts
 */
import fs from "fs";

const BASE_CERT_PATH = process.cwd() + '/src/assets/certs';
export const config = {
    mobileBankIdPolicy: '1.2.3.4.25',
    bankdIdUrl: process.env.BANKID_URL,
    pfx: fs.readFileSync(`${BASE_CERT_PATH}/smooother.p12`),
    passphrase: process.env.BANKID_PASSPHRASE,
    ca: fs.readFileSync(`${BASE_CERT_PATH}/smooother.cer`),
};