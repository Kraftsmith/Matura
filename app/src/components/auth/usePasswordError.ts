import { ApiError } from '../../accountApi';
import { useSettings } from '../../useSettings';

export const usePasswordError = () => {
  const { t } = useSettings();
  return (e: unknown): string => {
    if (e instanceof ApiError && e.code === 'bad_password') {
      return t(e.problem === 'too_long' ? 'auth.tooLong' : e.problem === 'too_common' ? 'auth.tooCommon' : 'auth.tooShort');
    }
    return t(e instanceof ApiError && e.status === 429 ? 'auth.tooMany' : 'auth.failed');
  };
};
