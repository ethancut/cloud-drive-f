
export interface AuthTokens {
    access_token: string;
    refresh_token: string;
}

export function saveTokens(tokens: AuthTokens): void {
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
}

export function getAccessToken(): string | null {
    return localStorage.getItem("access_token");
}

export function getRefreshToken(): string | null {
    return localStorage.getItem("refresh_token");
}

export function clearTokens(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
}

// track refresh promise to prevent race condition
let refreshPromise: Promise<string | null> | null = null; 

export async function refreshAccessToken(): Promise<string | null> {
const refreshToken = getRefreshToken();
    if (!refreshToken) {
        clearTokens();
        return null;
    }
    if (refreshPromise) {
        return refreshPromise;
    }
    refreshPromise = (async () => {
        try {
            const res = await fetch(`${import.meta.env.PUBLIC_API_URL}/auth/refresh`,{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ refresh_token: refreshToken })
            });
            if (!res.ok) {
                clearTokens();
                return null;
            }
            const data: AuthTokens = await res.json();
            saveTokens(data);
            return data.access_token;
        } catch (err) {
            clearTokens();
            window.location.href = "/login";
            return null;
        } finally {
            refreshPromise = null;
        }
    })();
    return refreshPromise;
}

export async function authFetch(url: string, init: RequestInit = {}): Promise<Response> {
  let token = getAccessToken();
  const headers = new Headers(init.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  init.headers = headers;

  let response = await fetch(url, init);

  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers.set("Authorization", `Bearer ${newToken}`);
      init.headers = headers;
      response = await fetch(url, init); // Retry original request
    }
  }

  return response;
}