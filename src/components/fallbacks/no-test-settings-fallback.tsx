import { FallbackItem } from '../ui/fallback-item';

export function NoTestSettingsFallback() {
  return (
    <FallbackItem
      title="No test settings found"
      description="Please try signing out and in again."
      linkButton={false}
    />
  );
}
