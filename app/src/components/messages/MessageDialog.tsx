import React, { useState } from 'react';
import { ApiError } from '../../accountApi';
import { sendMessage } from '../../notificationsApi';
import { useSettings } from '../../useSettings';
import { Button, Dialog, TextArea } from '../ui';

const MAX = 500;

interface MessageDialogProps {
  /** One learner, or every participant of a lesson: each gets their own copy. */
  students: { id: string; name: string }[];
  homeworkId?: string;
  lessonId?: string;
  initialText?: string;
  onClose: () => void;
  onSent?: () => void;
}

/** The teacher's short message to a learner (Spec - Powiadomienia §7.3): on the site at once, by mail if they want it. */
export const MessageDialog: React.FC<MessageDialogProps> = ({ students, homeworkId, lessonId, initialText = '', onClose, onSent }) => {
  const { t } = useSettings();
  const [text, setText] = useState(initialText);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const trimmed = text.trim();

  const send = async () => {
    setBusy(true);
    setError(undefined);
    try {
      for (const s of students) await sendMessage(s.id, { text: trimmed, homeworkId, lessonId });
      onSent?.();
      onClose();
    } catch (e) {
      setError(e instanceof ApiError && e.status === 429 ? t('msg.limit') : t('msg.failed'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      title={students.length === 1 ? t('msg.titleTo', { name: students[0].name }) : t('msg.toParticipants')}
      onClose={onClose}
      footer={
        <>
          <Button disabled={busy || trimmed.length === 0 || trimmed.length > MAX} onClick={() => void send()}>
            {t('msg.send')}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            {t('add.cancel')}
          </Button>
          {error && <span className="text-sm leading-5 text-error">{error}</span>}
        </>
      }
    >
      {students.length > 1 && <p className="text-sm leading-5 text-ink-2">{students.map((s) => s.name).join(', ')}</p>}
      <TextArea
        label={t('msg.text')}
        hint={`${t('msg.hint')} · ${trimmed.length}/${MAX}`}
        rows={4}
        maxLength={MAX}
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </Dialog>
  );
};
