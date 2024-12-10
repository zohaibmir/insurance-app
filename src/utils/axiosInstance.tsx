import axios from "axios";
import https from "https";
import { config } from "@/config/config";

export const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    pfx: config.pfx,
    passphrase: config.passphrase,
    ca: config.ca,
    rejectUnauthorized: false, // Note: Handle security risks in production
  }),
  headers: {
    "Content-Type": "application/json",
  },
});
