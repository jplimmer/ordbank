import { FallbackItem } from '../ui/fallback-item';

export function ErrorFallback() {
  return (
    <FallbackItem
      title="Something went wrong!"
      description="Please try refreshing the page or signing out and back in again."
      linkButton={false}
    />
  );
}
