import axios from "axios";

const normalizeApiUrl = (url: string) => url.replace(/\/$/, "");
const toHealthUrl = (apiUrl: string) => `${normalizeApiUrl(apiUrl).replace(/\/api$/, "")}/health`;

const buildApiCandidates = () => {
  const candidates = new Set<string>();
  const configuredUrl = import.meta.env.VITE_API_URL as string | undefined;

  if (configuredUrl) {
    candidates.add(normalizeApiUrl(configuredUrl));
  }

  if (typeof window !== "undefined") {
    const savedUrl = localStorage.getItem("elegant_beauty_api_url");
    if (savedUrl) {
      candidates.add(normalizeApiUrl(savedUrl));
    }

    const { hostname, protocol } = window.location;
    if (hostname.includes("frontend-production.up.railway.app")) {
      candidates.add(`${protocol}//${hostname.replace("frontend-production", "backend-production")}/api`);
      candidates.add(`${protocol}//${hostname.replace("frontend", "backend")}/api`);
      candidates.add("https://elegant-beauty-suitebackend-production.up.railway.app/api");
    }
  }

  candidates.add("http://localhost:4000/api");
  return [...candidates];
};

let resolvedApiUrl: string | null = null;
let resolvingApiUrl: Promise<string> | null = null;

const canReachApi = async (apiUrl: string) => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch(toHealthUrl(apiUrl), {
      method: "GET",
      signal: controller.signal,
      cache: "no-store"
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timeoutId);
  }
};

const resolveApiUrl = async () => {
  if (resolvedApiUrl) {
    return resolvedApiUrl;
  }

  if (!resolvingApiUrl) {
    resolvingApiUrl = (async () => {
      const candidates = buildApiCandidates();
      for (const candidate of candidates) {
        if (await canReachApi(candidate)) {
          resolvedApiUrl = candidate;
          localStorage.setItem("elegant_beauty_api_url", candidate);
          return candidate;
        }
      }

      resolvedApiUrl = candidates[0];
      return candidates[0];
    })();
  }

  return resolvingApiUrl;
};

export const api = axios.create({
  timeout: 6000,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use(async (config) => {
  config.baseURL = await resolveApiUrl();
  const token = localStorage.getItem("elegant_beauty_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
