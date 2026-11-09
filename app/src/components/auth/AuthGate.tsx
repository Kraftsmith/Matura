import React, { useEffect, useState } from 'react';
import { Button } from '../ui';
import { useSettings } from '../../useSettings';
import { publicPage, publicQuery } from '../../userRoute';
import type { AccountUser } from '../../users';
import { AuthShell, ForgotScreen, JoinScreen, LoginScreen, RegisterScreen, ResetScreen, VerifyScreen } from './AuthScreens';
import { OnboardingStep, TermsStep } from './FirstRun';
import { RETURN_KEY } from './returnTo';

export type GateStatus = 'loading' | 'anon' | 'offline' | 'ready';

const rememberAddress = (hash: string) => {
  try {
    if (hash && hash !== '#') window.sessionStorage.setItem(RETURN_KEY, hash.replace(/^#/, ''));
  } catch {
    /* storage unavailable: after signing in the dashboard opens instead */
  }
};

interface AuthGateProps {
  status: GateStatus;
  expired: boolean;
  user: AccountUser | undefined;
  onSignedIn: (user: AccountUser) => void;
  onAccount: (user: AccountUser) => void;
  onRetry: () => void;
  children: React.ReactNode;
}

/** Nothing of the app renders until the server says who this is. */
export const AuthGate: React.FC<AuthGateProps> = ({ status, expired, user, onSignedIn, onAccount, onRetry, children }) => {
  const { t } = useSettings();
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const route = publicPage(hash);
  const needsLogin = status === 'anon' && !route;

  useEffect(() => {
    if (needsLogin) rememberAddress(hash);
  }, [needsLogin, hash]);

  // The legal texts are pages of the public site; the old app addresses only forward there.
  if (route?.page === 'regulamin' || route?.page === 'prywatnosc') {
    window.location.replace(route.page === 'regulamin' ? '/regulamin' : '/polityka-prywatnosci');
    return null;
  }
  if (route?.page === 'verify') return <VerifyScreen token={route.param ?? ''} onSignedIn={onSignedIn} />;
  if (route?.page === 'reset') return <ResetScreen token={route.param ?? ''} onSignedIn={onSignedIn} />;

  if (status === 'loading') return <AuthShell title={t('auth.loading')} />;

  // A lost connection must not look like being signed out.
  if (status === 'offline') {
    return (
      <AuthShell title={t('auth.offline')}>
        <Button onClick={onRetry}>{t('auth.retry')}</Button>
      </AuthShell>
    );
  }

  if (status === 'anon' || !user) {
    if (route?.page === 'forgot') return <ForgotScreen />;
    if (route?.page === 'register') return <RegisterScreen query={publicQuery(hash)} />;
    if (route?.page === 'join') return <RegisterScreen inviteCode={route.param} />;
    return <LoginScreen expired={expired} onSignedIn={onSignedIn} query={publicQuery(hash)} />;
  }

  if (route?.page === 'join') return <JoinScreen code={route.param ?? ''} user={user} onAccount={onAccount} />;
  if (!user.termsAccepted) return <TermsStep onAccount={onAccount} />;
  if (!user.onboarded && user.role === 'student') return <OnboardingStep onAccount={onAccount} />;

  return children;
};
