import { PropsWithChildren } from 'react';

import { AuthScreen } from './AuthScreen';
import { Splash } from './Splash';
import { useAuthStore } from '@/state/AuthStore';

export function RequireAuth({ children }: PropsWithChildren) {
  const { isReady, session } = useAuthStore();

  if (!isReady) return <Splash />;
  if (!session) return <AuthScreen />;

  return children;
}
