
interface FetchOptions extends RequestInit {
  timeout?: number;
}

/**
 * A robust wrapper around fetch with error handling and timeout.
 */
export async function safeFetch<T>(url: string, options: FetchOptions = {}): Promise<T | null> {
  const { timeout = 10000, ...fetchOptions } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(id);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `API Error: ${response.status} ${response.statusText}`;
      console.error("API Response Error:", errorMessage);
      return null;
    }

    return await response.json();
  } catch (error: any) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      console.error("Request timed out");
    } else {
      console.error("Network Fetch Error:", error);
    }
    return null;
  }
}
