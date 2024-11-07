'use client';

import { backButton } from '@telegram-apps/sdk-react';
import { PropsWithChildren, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function Page({ children, back = false }: PropsWithChildren<{
  /**
   * True if it is allowed to go back from this page.
   * @default false
   */
  back?: boolean
}>) {
  const router = useRouter();

  useEffect(() => {
    if (back) {
      backButton.show();
    } else {
      backButton.hide();
    }
  }, [back]);

  useEffect(() => {
    return backButton.onClick(() => {
      router.back();
    });
  }, [router]);

  return <>{children}</>;
}