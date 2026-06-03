/**
 * API Client for Правовой Пилигрим backend.
 * Browser hits Django directly on localhost:8001 (CORS enabled).
 */

const API_BASE =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8001/api/v1"
    : "/api/v1";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SiteSettings {
  site_name: string;
  phone: string;
  email: string;
  address: string;
  working_hours: string;
  company_details: string;
  telegram: string;
  whatsapp: string;
  yandex_metrika_id: string;
  google_analytics_id: string;
}

export interface Service {
  id: number;
  title: string;
  slug: string;
  h1: string;
  short_description: string;
  content: string;
  icon: string | null;
  cover_image: string | null;
  is_featured: boolean;
  seo_title: string;
  seo_description: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image: string | null;
  schema_type: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  h1: string;
  excerpt: string;
  content: string;
  category: { name: string; slug: string } | null;
  tags: string;
  author: string;
  cover_image: string | null;
  is_news: boolean;
  is_expert_article: boolean;
  is_featured: boolean;
  reading_time: number;
  published_at: string;
  seo_title: string;
  seo_description: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export interface Case {
  id: number;
  title: string;
  slug: string;
  debt_amount: string;
  case_duration: string;
  client_problem: string;
  what_was_done: string;
  result: string;
  lawyer_comment: string;
  disclaimer: string;
  cover_image: string | null;
  seo_title: string;
  seo_description: string;
}

export interface Review {
  id: number;
  author_name: string;
  rating: number;
  text: string;
  source: string;
  source_url: string;
  is_published: boolean;
  created_at: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  h1: string;
  content: string;
  seo_title: string;
  seo_description: string;
}

export interface LeadData {
  name?: string;
  phone: string;
  email?: string;
  message?: string;
  debt_amount?: string;
  source_page?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  consent_accepted: boolean;
  website?: string; // honeypot
  _ts?: number; // timestamp trap
  _hid?: string; // behavioral trap
}

export interface ChatResponse {
  reply: string;
  disclaimer: string;
  is_fallback: boolean;
}

// ─── Fetch Utility ───────────────────────────────────────────────────────────

class APIError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

let csrfToken: string | null = null;

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Add CSRF token for mutating requests
  if (
    options.method &&
    ["POST", "PUT", "PATCH", "DELETE"].includes(options.method)
  ) {
    if (csrfToken) {
      headers["X-CSRFToken"] = csrfToken;
    }
  }

  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });
  } catch (err) {
    // Network error (CORS, offline, etc.)
    throw new APIError(`Network error: ${err}`, 0, { detail: String(err) });
  }

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new APIError(
      `API Error: ${res.status} ${res.statusText}`,
      res.status,
      data,
    );
  }

  return res.json();
}

// ─── CSRF ────────────────────────────────────────────────────────────────────

export async function getCSRFToken(): Promise<string> {
  const data = await fetchAPI<{ csrfToken: string }>("/csrf/");
  csrfToken = data.csrfToken;
  return csrfToken;
}

// ─── Read Endpoints ──────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings> {
  return fetchAPI<SiteSettings>("/site-settings/");
}

export async function getServices(): Promise<Service[]> {
  return fetchAPI<Service[]>("/services/");
}

export async function getServiceBySlug(slug: string): Promise<Service> {
  return fetchAPI<Service>(`/services/${slug}/`);
}

export async function getBlogPosts(params?: string): Promise<BlogPost[]> {
  const query = params ? `?${params}` : "";
  return fetchAPI<BlogPost[]>(`/blog/posts/${query}`);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost> {
  return fetchAPI<BlogPost>(`/blog/posts/${slug}/`);
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  return fetchAPI<BlogCategory[]>("/blog/categories/");
}

export async function getCases(): Promise<Case[]> {
  return fetchAPI<Case[]>("/cases/");
}

export async function getCaseBySlug(slug: string): Promise<Case> {
  return fetchAPI<Case>(`/cases/${slug}/`);
}

export async function getReviews(): Promise<Review[]> {
  return fetchAPI<Review[]>("/reviews/");
}

export async function getFAQ(): Promise<FAQ[]> {
  return fetchAPI<FAQ[]>("/faq/");
}

export async function getPages(): Promise<Page[]> {
  return fetchAPI<Page[]>("/pages/");
}

export async function getPageBySlug(slug: string): Promise<Page> {
  return fetchAPI<Page>(`/pages/${slug}/`);
}

// ─── Write Endpoints ─────────────────────────────────────────────────────────

export async function submitLead(data: LeadData): Promise<unknown> {
  if (!csrfToken) await getCSRFToken();
  return fetchAPI("/leads/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function submitQuizLead(data: LeadData): Promise<unknown> {
  if (!csrfToken) await getCSRFToken();
  return fetchAPI("/leads/quiz/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function submitCallback(data: LeadData): Promise<unknown> {
  if (!csrfToken) await getCSRFToken();
  return fetchAPI("/leads/callback/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function sendChatMessage(
  message: string,
  quizContext?: Record<string, string>,
): Promise<ChatResponse> {
  return fetchAPI<ChatResponse>("/chat/", {
    method: "POST",
    body: JSON.stringify({ message, quiz_context: quizContext || null }),
  });
}

/**
 * Stream chat response via SSE.
 * Calls onChunk for each text chunk, onDone when stream ends.
 */
export async function streamChatMessage(
  message: string,
  quizContext: Record<string, string> | undefined,
  onChunk: (chunk: string) => void,
  onDone: () => void,
  onError: (err: Error) => void,
): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/chat/stream/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ message, quiz_context: quizContext || null }),
    });

    if (!res.ok || !res.body) {
      throw new Error(`Stream failed: ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Parse SSE events: each event is "data: ...\n\n"
      const events = buffer.split("\n\n");
      buffer = events.pop() || ""; // Keep incomplete event in buffer

      for (const event of events) {
        if (!event.startsWith("data: ")) continue;
        const data = event.slice(6); // Remove "data: " prefix
        if (data === "[DONE]") {
          onDone();
          return;
        }
        // Parse JSON-encoded chunk to handle newlines/special chars
        try {
          const chunk = JSON.parse(data);
          onChunk(chunk);
        } catch {
          // Fallback to raw data if not JSON
          onChunk(data);
        }
      }
    }
    onDone();
  } catch (err) {
    onError(err instanceof Error ? err : new Error(String(err)));
  }
}

export async function resetChat(): Promise<void> {
  await fetchAPI("/chat/reset/", { method: "POST", body: "{}" });
}
