const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

async function request<T>(method: HttpMethod, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  post: <T>(path: string, body: unknown) => request<T>('POST', path, body),
  get:  <T>(path: string)                => request<T>('GET', path),
};