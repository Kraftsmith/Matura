import React, { useEffect, useState } from 'react';
import { Check, Link2 } from 'lucide-react';
import { Button, type ButtonVariant } from './ui';
import { useSettings } from '../useSettings';
import { useUser } from '../useUser';
import { shareLink } from '../userRoute';

interface CopyLinkButtonProps {
  /** Page route without the profile, e.g. "czlowiek/slownictwo/czl-txt-1". */
  rest: string;
  variant?: ButtonVariant;
}

/** Teacher only: copies a profile-free link to a page or exercise, to send as homework. */
export const CopyLinkButton: React.FC<CopyLinkButtonProps> = ({ rest, variant = 'ghost' }) => {
  const { t } = useSettings();
  const { user } = useUser();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  if (user.role !== 'teacher') return null;

  const url = shareLink(rest);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      /* clipboard blocked (e.g. plain http): the link is still in the tooltip */
    }
  };

  return (
    <Button variant={variant} size="sm" onClick={copy} title={`${t('link.copyHint')}: ${url}`}>
      {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      {copied ? t('link.copied') : t('link.copy')}
    </Button>
  );
};
