import React, { useEffect, useState } from 'react';
import { Check, Link2 } from 'lucide-react';
import { Button, type ButtonVariant } from './ui';
import { useSettings } from '../useSettings';
import { shareLink } from '../userRoute';

interface CopyLinkButtonProps {
  /** Page route without the profile, e.g. "czlowiek/slownictwo/czl-txt-1". */
  rest: string;
  variant?: ButtonVariant;
}

/** Copies a profile-free link to a page or exercise, e.g. to send as homework. */
export const CopyLinkButton: React.FC<CopyLinkButtonProps> = ({ rest, variant = 'ghost' }) => {
  const { t } = useSettings();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  const url = shareLink(rest);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard API unavailable (plain http, older browser): fall back to a hidden textarea.
      const area = document.createElement('textarea');
      area.value = url;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
    setCopied(true);
  };

  return (
    <Button variant={variant} size="sm" onClick={copy} title={`${t('link.copyHint')}: ${url}`}>
      {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      {copied ? t('link.copied') : t('link.copy')}
    </Button>
  );
};
