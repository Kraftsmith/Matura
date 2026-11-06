import type { ProgressState } from './progress-context';
import type { AccountUser, ClassStudent, ExamPlan } from './users';

export class ApiError extends Error {
  status: number;
  code?: string;
  problem?: string;

  constructor(status: number, code?: string, problem?: string) {
    super(code ?? `Request failed: ${status}`);
    this.status = status;
    this.code = code;
    this.problem = problem;
  }
}

const request = async <T>(method: string, url: string, body?: unknown): Promise<T> => {
  const res = await fetch(url, {
    method,
    headers: body === undefined ? undefined : { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = (await res.json().catch(() => null)) as { error?: string; problem?: string } | null;
  if (!res.ok) throw new ApiError(res.status, data?.error, data?.problem);
  return data as T;
};

type UserAnswer = { user: AccountUser };
const asUser = async (answer: Promise<UserAnswer>) => (await answer).user;
const auth = <T>(action: string, body: unknown) => request<T>('POST', `/api/auth?action=${action}`, body);
const account = <T>(action: string, body: unknown = {}) => request<T>('POST', `/api/account?action=${action}`, body);

export interface Registration {
  name: string;
  role: 'student' | 'teacher';
  email: string;
  password: string;
  acceptedTerms: boolean;
  uiLang: string;
  inviteCode?: string;
  /** Hidden from people; only a bot fills it in. */
  website: string;
}

export const register = (data: Registration) => auth('register', data);
export const resendVerification = (email: string) => auth('resend', { email });
export const verifyEmail = (token: string) => asUser(auth<UserAnswer>('verify', { token }));
export const login = (email: string, password: string) => asUser(auth<UserAnswer>('login', { email, password }));
export const logout = (everywhere = false) => auth('logout', { everywhere });
export const forgotPassword = (email: string) => auth('forgot', { email });
export const resetPassword = (token: string, password: string) => asUser(auth<UserAnswer>('reset', { token, password }));
export const fetchInvite = (code: string) => request<{ teacher: { name: string } }>('GET', `/api/auth?invite=${encodeURIComponent(code)}`).then((r) => r.teacher);

export const fetchMe = () => asUser(request<UserAnswer>('GET', '/api/me'));
export const patchMe = (patch: Record<string, unknown>) => asUser(request<UserAnswer>('PATCH', '/api/me', patch));

export const changePassword = (currentPassword: string, newPassword: string) => account('change-password', { currentPassword, newPassword });
export const changeEmail = (currentPassword: string, newEmail: string) => account('change-email', { currentPassword, newEmail });
export const joinClass = (code: string) => asUser(account<UserAnswer>('join', { code }));
export const leaveClass = () => asUser(account<UserAnswer>('leave'));
export const deleteAccount = (password: string) => request('DELETE', '/api/account', { password });

export const fetchProgress = () => request<{ state: ProgressState }>('GET', '/api/progress').then((r) => r.state);
export const putModule = (moduleId: string, data: unknown) => request('PUT', `/api/progress?moduleId=${moduleId}`, data);
export const putMeta = (meta: unknown) => request('PUT', '/api/progress', meta);

export const fetchClass = () => request<{ students: ClassStudent[] }>('GET', '/api/class').then((r) => r.students);
export const fetchClassCode = () => request<{ code: string }>('GET', '/api/class?invite=1').then((r) => r.code);
export const replaceClassCode = () => request<{ code: string }>('POST', '/api/class').then((r) => r.code);
export const inviteByEmail = (email: string) => request('POST', '/api/class', { email });
export const removeStudent = (id: string) => request('DELETE', `/api/students/${id}`);
export const clearStudentProgress = (id: string) => request('DELETE', `/api/students/${id}?what=progress`);
export const patchStudent = (id: string, plan: ExamPlan) =>
  request('PATCH', `/api/students/${id}`, { examDate: plan.examDate ?? null, level: plan.level ?? null, goal: plan.goal ?? null });
