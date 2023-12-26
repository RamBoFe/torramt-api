import environment from "./environment.service.ts";
import axios from "axios";
import moment from "moment";
interface CloudflareResponse {
  cookies: string;
  userAgent: string;
}

export class CloudflareService {
  private SESSION = {
    timeout: 10,
    elapsed: moment().subtract(10 + 1, "minutes"),
  };

  constructor() {
    Object.defineProperty(this.SESSION, "timeout", {
      writable: false,
    });
  }

  async bypass(url: string): Promise<CloudflareResponse | undefined> {
    try {
      const response = await axios.post(
        `${environment.get("cloudflare_bypass_url")}`,
        {
          cmd: "request.get",
          url,
        },
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      const clearance = response.data.solution.cookies.find(
        (cookie: { name: string }) => cookie.name === "cf_clearance",
      );

      if (clearance) {
        this.SESSION.elapsed = moment();
        return {
          cookies: `cf_clearance=${clearance.value};`,
          userAgent: response.data.solution.userAgent,
        };
      }
    } catch (e) {
      throw new Error(
        `Un problème est survenu lors de la tentative de contournement de la protection Cloudflare : ${e}`,
      );
    }

    return undefined;
  }

  isSessionMustRefreshed(): boolean {
    return (
      moment().diff(this.SESSION.elapsed, "minutes") > this.SESSION.timeout
    );
  }
}

const cloudflareSrv = new CloudflareService();
export default cloudflareSrv;
