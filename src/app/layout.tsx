import type { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

import "./_reset.scss";
import "./_index.scss";
import '@telegram-apps/telegram-ui/dist/styles.css';
import {I18nProvider} from "@entities/i18n/provider";
import {Root} from "@twa/Root/Root";

export const metadata: Metadata = {
  title: 'Your Application Title Goes Here',
  description: 'Your application description goes here',
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
    <body>
      <I18nProvider>
        <Root>
          {children}
        </Root>
      </I18nProvider>
    </body>
    </html>
  );
}
