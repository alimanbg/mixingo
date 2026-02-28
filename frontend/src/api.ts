const API_BASE = "http://localhost:8000";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `API error: ${res.status}`);
  }
  return res.json();
}

export async function submitWarmup(
  userId: string,
  answers: Array<{
    question_id: string;
    answer: string;
    time_taken: number;
    correct: boolean;
    category: string;
  }>
) {
  const body = { user_id: userId || "", answers };
  const res = await fetch(`${API_BASE}/api/warmup/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse<{ user_id: string; signals: Record<string, unknown> }>(res);
}

export async function analyzeCTM(userId: string) {
  const res = await fetch(`${API_BASE}/api/ctm/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
  });
  return handleResponse(res);
}

export async function generateExercises(moduleId: string, userId?: string) {
  const body = userId
    ? { module_id: moduleId, user_id: userId }
    : { module_id: moduleId };
  const res = await fetch(`${API_BASE}/api/exercises/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function getDemoCTM() {
  const res = await fetch(`${API_BASE}/api/demo/ctm`);
  return handleResponse(res);
}

export async function getDemoProfile() {
  const res = await fetch(`${API_BASE}/api/demo/profile`);
  return handleResponse(res);
}

export async function getDemoExercises() {
  const res = await fetch(`${API_BASE}/api/demo/exercises`);
  return handleResponse(res);
}
