import { useEffect } from 'react';

import { COMPANY_NAME } from '../constants/branding';

export type HeadData = {
  title: string;
  favicon: string;
};

const defaultHeadData: HeadData = {
  title: COMPANY_NAME,
  favicon: '/favicon.svg',
};

const baseTitle = ` | ${COMPANY_NAME}`;

/**
 * Updates the document title and favicon.
 */
export default function Head({ title, favicon }: Partial<HeadData>) {
  useEffect(() => {
    document.title = `${title || defaultHeadData.title}${baseTitle}`;
    const link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    if (link) {
      link.href = favicon || defaultHeadData.favicon;
    }
  }, [title, favicon]);

  return null;
}
