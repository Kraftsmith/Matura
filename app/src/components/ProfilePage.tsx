import React, { useState } from 'react';
import { ApiError, changeEmail, changePassword, deleteAccount, leaveClass, logout, patchMe } from '../accountApi';
import { Button, Callout, TextField } from './ui';
import { PasswordField } from './auth/AuthScreens';
import { usePasswordError } from './auth/usePasswordError';
import { ExamFields } from './ExamFields';
import { ClassInvite } from './ClassInvite';
import { Avatar } from './GrammarStatusChip';
import { allModules } from '../data/modulesData';
import { formatRelative, summarizeUser } from '../progressSummary';
import { useTeacherCards } from '../useTeacherCards';
import { useProgress } from '../useProgress';
import { useSettings } from '../useSettings';
import { useUser } from '../useUser';
import type { ExamPlan } from '../users';

const Block: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="grid gap-4 card p-5">
    <h2 className="text-xl leading-7 font-semibold">{title}</h2>
    {children}
  </section>
);

const Done: React.FC<{ text?: string }> = ({ text }) => (text ? <p role="status" className="text-sm leading-5 text-success">{text}</p> : null);

const DataBlocks: React.FC = () => {
  const { t } = useSettings();
  const { user, setAccount } = useUser();
  const [name, setName] = useState(user.name);
  const [plan, setPlan] = useState<ExamPlan>({ examDate: user.examDate, level: user.level, goal: user.goal });
  const [done, setDone] = useState<string>();
  const [error, setError] = useState<string>();

  const save = (patch: Record<string, unknown>) => {
    setDone(undefined);
    setError(undefined);
    patchMe(patch).then(
      (me) => {
        setAccount(me);
        setDone(t('profile.saved'));
      },
      () => setError(t('auth.failed')),
    );
  };

  return (
    <>
      <Block title={t('profile.data')}>
        <TextField label={t('auth.name')} autoComplete="name" maxLength={60} value={name} onChange={(e) => setName(e.target.value)} />
        <div>
          <Button size="sm" disabled={!name.trim()} onClick={() => save({ name })}>
            {t('profile.save')}
          </Button>
        </div>
      </Block>
      {user.role === 'student' && (
        <Block title={t('profile.matura')}>
          <ExamFields plan={plan} onChange={setPlan} />
          <div>
            <Button size="sm" onClick={() => save({ examDate: plan.examDate ?? null, level: plan.level ?? null, goal: plan.goal ?? null })}>
              {t('profile.save')}
            </Button>
          </div>
        </Block>
      )}
      <Done text={done} />
      {error && <p className="text-sm leading-5 text-error">{error}</p>}
    </>
  );
};

const AccountBlock: React.FC = () => {
  const { t } = useSettings();
  const { user, signOut } = useUser();
  const [emailPassword, setEmailPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [emailDone, setEmailDone] = useState<string>();
  const [emailError, setEmailError] = useState<string>();
  const [passwordDone, setPasswordDone] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();
  const describe = usePasswordError();

  const isWrongPassword = (e: unknown) => e instanceof ApiError && e.code === 'wrong_password';

  const submitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailDone(undefined);
    setEmailError(undefined);
    changeEmail(emailPassword, newEmail).then(
      () => {
        setEmailPassword('');
        setNewEmail('');
        setEmailDone(t('profile.emailSent'));
      },
      (err: unknown) => setEmailError(isWrongPassword(err) ? t('profile.wrongPassword') : t('auth.failed')),
    );
  };

  const submitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordDone(undefined);
    setPasswordError(undefined);
    changePassword(current, next).then(
      () => {
        setCurrent('');
        setNext('');
        setPasswordDone(t('profile.passwordChanged'));
      },
      (err: unknown) => setPasswordError(isWrongPassword(err) ? t('profile.wrongPassword') : describe(err)),
    );
  };

  const signOutEverywhere = () => {
    logout(true).then(signOut, () => undefined);
  };

  return (
    <Block title={t('profile.account')}>
      <form onSubmit={submitEmail} className="grid gap-3">
        <h3 className="font-semibold">{t('profile.changeEmail')}</h3>
        <p className="text-sm leading-5 text-ink-2">{t('profile.currentEmail', { email: user.email })}</p>
        <TextField label={t('profile.newEmail')} type="email" autoComplete="email" required value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
        <PasswordField label={t('profile.currentPassword')} autoComplete="current-password" required value={emailPassword} onChange={(e) => setEmailPassword(e.target.value)} error={emailError} />
        <div>
          <Button type="submit" size="sm" variant="secondary">
            {t('profile.changeEmail')}
          </Button>
        </div>
        <Done text={emailDone} />
      </form>

      <form onSubmit={submitPassword} className="grid gap-3 border-t border-line-soft pt-4">
        <h3 className="font-semibold">{t('profile.changePassword')}</h3>
        <PasswordField label={t('profile.currentPassword')} autoComplete="current-password" required value={current} onChange={(e) => setCurrent(e.target.value)} />
        <PasswordField label={t('auth.newPassword')} autoComplete="new-password" required hint={t('auth.passwordHint')} value={next} onChange={(e) => setNext(e.target.value)} error={passwordError} />
        <div>
          <Button type="submit" size="sm" variant="secondary">
            {t('profile.changePassword')}
          </Button>
        </div>
        <Done text={passwordDone} />
      </form>

      <div className="border-t border-line-soft pt-4">
        <Button size="sm" variant="ghost" onClick={signOutEverywhere}>
          {t('profile.signOutAll')}
        </Button>
      </div>
    </Block>
  );
};

/** Says nothing about what the teacher keeps: this page must not hint at notes. */
const TeacherBlock: React.FC = () => {
  const { t } = useSettings();
  const { user, setAccount } = useUser();

  const leave = () => {
    if (window.confirm(t('profile.leaveConfirm'))) leaveClass().then(setAccount, () => undefined);
  };

  return (
    <Block title={t('role.teacher')}>
      {user.teacher ? (
        <>
          <p className="text-base leading-6">{user.teacher.name}</p>
          <div>
            <Button size="sm" variant="ghost" onClick={leave}>
              {t('profile.leave')}
            </Button>
          </div>
        </>
      ) : (
        <p className="text-sm leading-5 text-ink-2">{t('profile.noTeacher')}</p>
      )}
    </Block>
  );
};

const YourDataBlock: React.FC = () => {
  const { t } = useSettings();
  const { signOut } = useUser();
  const { flush } = useProgress();
  const [asking, setAsking] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>();

  const remove = (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    deleteAccount(password).then(signOut, (err: unknown) => setError(err instanceof ApiError && err.code === 'wrong_password' ? t('profile.wrongPassword') : t('auth.failed')));
  };

  return (
    <Block title={t('profile.yourData')}>
      <div>
        <a href="/api/account" download onClick={() => void flush()} className="text-base leading-6 font-semibold text-primary hover:underline">
          {t('profile.export')}
        </a>
      </div>
      {asking ? (
        <form onSubmit={remove} className="grid gap-3">
          <Callout tone="error" title={t('profile.delete')}>
            {t('profile.deleteBody')}
          </Callout>
          <PasswordField label={t('profile.currentPassword')} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} error={error} />
          <div className="flex flex-wrap gap-2">
            <Button type="submit" size="sm">
              {t('profile.delete')}
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setAsking(false)}>
              {t('auth.joinLater')}
            </Button>
          </div>
        </form>
      ) : (
        <div>
          <Button size="sm" variant="ghost" onClick={() => setAsking(true)}>
            {t('profile.delete')}
          </Button>
        </div>
      )}
    </Block>
  );
};

/** The teacher's class as a list: who joined, when they last worked, how much they did. Opens the learner's page. */
const StudentsBlock: React.FC = () => {
  const { t, uiLang } = useSettings();
  const { students, classLoaded } = useUser();
  const { cardsOf } = useTeacherCards();
  const locale = uiLang === 'en' ? 'en-GB' : 'pl-PL';

  return (
    <>
      <Block title={t('profile.students')}>
        {!classLoaded ? null : students.length === 0 ? (
          <p className="text-sm leading-5 text-ink-2">{t('teacher.noStudents')}</p>
        ) : (
          <ul className="grid gap-2">
            {students.map((s) => {
              const sum = summarizeUser(allModules, s.progress, cardsOf(s.id));
              return (
                <li key={s.id}>
                  <a href={`#dashboard/${s.id}`} className="flex items-center gap-3 rounded-lg border border-line px-4 py-3 hover:bg-hero">
                    <Avatar initials={s.initials} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-base leading-6 font-semibold text-ink">{s.name}</span>
                      <span className="block truncate text-xs leading-4 text-ink-2">{s.email}</span>
                    </span>
                    <span className="text-right text-sm leading-5 text-ink-2">
                      <span className="block">
                        {t('work.title')}: <b className="font-semibold text-ink">{sum.workCount}</b>
                      </span>
                      <span className="block">{formatRelative(sum.lastActiveAt, t, locale)}</span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </Block>
      <ClassInvite />
    </>
  );
};

export const ProfilePage: React.FC = () => {
  const { t } = useSettings();
  const { user } = useUser();

  return (
    <div className="mx-auto grid w-full max-w-2xl gap-5">
      <h1 className="text-3xl leading-10 font-semibold">{t('profile.title')}</h1>
      <DataBlocks />
      {user.role === 'teacher' && <StudentsBlock />}
      <AccountBlock />
      {user.role === 'student' && <TeacherBlock />}
      {user.role === 'student' && <YourDataBlock />}
    </div>
  );
};
