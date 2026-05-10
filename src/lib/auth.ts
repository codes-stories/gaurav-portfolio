function parseCookie(cookieHeader: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!cookieHeader) return result;
  const pairs = cookieHeader.split(";");
  for (const pair of pairs) {
    const idx = pair.indexOf("=");
    if (idx < 0) continue;
    const key = pair.slice(0, idx).trim();
    let val = pair.slice(idx + 1).trim();
    try {
      val = decodeURIComponent(val);
    } catch {}
    result[key] = val;
  }
  return result;
}

export function getAdminToken() {
  return process.env.ADMIN_TOKEN || process.env.ADMIN_PASSWORD || "admin123";
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "admin123";
}

export function requireAdmin(req: Request | { headers?: any }) {
  const ADMIN_TOKEN = getAdminToken();

  // Check x-admin-token header first
  try {
    const headers = (req as any).headers;
    let token: string | null = null;
    if (headers?.get) {
      token = headers.get("x-admin-token");
    } else if (headers && typeof headers === "object") {
      token = headers["x-admin-token"] || null;
    }

    // If not in header, check cookie header
    if (!token && headers) {
      const cookieHeader = headers.get ? headers.get("cookie") : headers["cookie"];
      if (cookieHeader) {
        const cookies = parseCookie(cookieHeader);
        token = cookies["admin-token"];
      }
    }

    if (!token || token !== ADMIN_TOKEN) {
      const err: any = new Error("Unauthorized");
      err.status = 401;
      throw err;
    }
  } catch (e) {
    const err: any = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }
}
