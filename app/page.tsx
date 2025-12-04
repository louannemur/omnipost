import '@root/global.scss';
import '@root/animations.scss';

import SocialMediaPoster from '@components/SocialMediaPoster';
import Package from '@root/package.json';

export async function generateMetadata({ params, searchParams }) {
  const title = 'OMNIPOST';
  const description = 'Create and post content to multiple social media platforms';
  const url = 'https://wireframes.internet.dev';

  return {
    metadataBase: new URL('https://wireframes.internet.dev'),
    title,
    description,
    url,
    openGraph: {
      title,
      description,
      url,
      type: 'website',
    },
    twitter: {
      title,
      description,
      url,
      card: 'summary_large_image',
    },
    icons: {
      icon: '/logo.svg',
    },
  };
}

export default async function Page(props) {
  return <SocialMediaPoster />;
}
