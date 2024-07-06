import Head from '../../components/head';
import { SPLASH_TITLE } from '../../constants/branding';
import SplashSection from './1-splash';
import BodySection from './2-body';
import ActionSection from './3-action';
import FooterSection from './4-footer';

export default function HomePage() {
  return (
    <>
      <Head title={SPLASH_TITLE} />
      <SplashSection />
      <BodySection />
      <ActionSection />
      <FooterSection />
    </>
  );
}
