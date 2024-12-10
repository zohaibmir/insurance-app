import fs from "fs";

const BASE_CERT_PATH = process.cwd() + '/src/assets/certs';
const BANKID_API_VERSION = '6.0';
console.log(BASE_CERT_PATH);
export const config = {
    mobileBankIdPolicy: '1.2.3.4.25',
    bankdIdUrl: `https://appapi2.bankid.com/rp/v${BANKID_API_VERSION}`,
    pfx: fs.readFileSync(`${BASE_CERT_PATH}/smooother.p12`),
    passphrase: 'cDf8A-wmjx2LxsYN',
    ca: fs.readFileSync(`${BASE_CERT_PATH}/smooother.cer`),
};