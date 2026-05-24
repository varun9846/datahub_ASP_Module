import axios from "axios";
import { cfg } from "../config.js";
import https from "https";

const insecureHttpsAgent = new https.Agent({
  rejectUnauthorized: false
});

const ASP_URL = cfg.ASP_API_BASE_URL;

export async function getToken() {
  try {
    const res = await axios.post(
      `${ASP_URL}/auth/token`,
      null,
      {
        httpsAgent: insecureHttpsAgent,
        params: {
          orgId: cfg.ASP_API_ORGID,
          userId: cfg.ASP_API_USERNAME,
          password: cfg.ASP_API_PASSWORD
        }
      }
    );

    return res.data?.token ?? null;

  } catch (error) {
    console.error("Failed to create ASP token", error?.cause || error);
    return null;
  }
}

export async function getSessions(params, siteToken = "all") {
  try {
    const tokenValue = await getToken();
    if (!tokenValue) return null;

    const res = await axios.get(
      `${ASP_URL}/sites/${siteToken}/sessions`,
      {
        httpsAgent: insecureHttpsAgent,
        params,
        headers: {
          Authorization: tokenValue,
          "Content-Type": "application/json;charset=utf-8"
        }
      }
    );

    return res.data;

  } catch (error) {
    console.error("Failed to get data", error?.cause || error);
    return null;
  }
}
