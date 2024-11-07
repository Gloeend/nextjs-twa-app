'use client';

import '@telegram-apps/telegram-ui/dist/styles.css';
import { type PropsWithChildren, useEffect } from 'react';
import {
  initData,
  miniApp,
  useLaunchParams,
  useSignal,
} from '@telegram-apps/sdk-react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { AppRoot } from '@telegram-apps/telegram-ui';

import './styles.css';
import {useTelegramMock} from "@shared/hooks/useTelegramMock";
import {useClientOnce} from "@shared/hooks/useClientOnce";
import {init} from "@entities/init";
import {setLocale} from "@entities/i18n/locale";
import {useDidMount} from "@shared/hooks/useDidMount";
import {ErrorPage} from "../ErrorPage";
import {ErrorBoundary} from "../ErrorBoundary";

function RootInner({ children }: PropsWithChildren) {
  const isDev = process.env.NODE_ENV === 'development';

  // Mock Telegram environment in development mode if needed.
  if (isDev) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTelegramMock();
  }

  const lp = useLaunchParams();
  const debug = isDev || lp.startParam === 'debug';

  // Initialize the library.
  useClientOnce(() => {
    init(debug);
  });

  const isDark = useSignal(miniApp.isDark);
  const initDataUser = useSignal(initData.user);

  // Set the user locale.
  useEffect(() => {
    initDataUser && setLocale(initDataUser.languageCode);
  }, [initDataUser]);

  // Enable debug mode to see all the methods sent and events received.
  useEffect(() => {
    debug && import('eruda').then((lib) => lib.default.init());
  }, [debug]);

  return (
    <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
      <AppRoot
        appearance={isDark ? 'dark' : 'light'}
        platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}
      >
        {children}
      </AppRoot>
    </TonConnectUIProvider>
  );
}

export function Root({children}: PropsWithChildren) {
  // Unfortunately, Telegram Mini Apps does not allow us to use all features of
  // the Server Side Rendering. That's why we are showing loader on the server
  // side.
  const didMount = useDidMount();

  return didMount ? (
    <ErrorBoundary fallback={ErrorPage}>
      {/* @ts-ignore */}
      <RootInner>{children}</RootInner>
    </ErrorBoundary>
  ) : <div className="root__loading">Loading</div>;
}
