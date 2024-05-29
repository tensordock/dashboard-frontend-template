import { useEffect } from 'react';

export type HeadData = {
  title: string;
  favicon: string;
};

const defaultHeadData: HeadData = {
  title: `H100cloud.com`,
  favicon: '/vite.svg',
};

/**
 * Updates the document title and favicon.
 */
export default function Head({ title, favicon }: Partial<HeadData>) {
  useEffect(() => {
    document.title = title || defaultHeadData.title;
    const link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    if (link) {
      link.href = favicon || defaultHeadData.favicon;
    }
  }, [title, favicon]);

  return null;
}
