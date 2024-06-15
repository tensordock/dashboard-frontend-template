import Head from '../../components/head';
import * as constants from '../../constants';
import SplashSection from './1-splash';
import BodySection from './2-body';
import ActionSection from './3-action';
import FooterSection from './4-footer';

export default function HomePage() {
  return (
    <>
      <Head title={constants.SPLASH_TITLE} />
      <SplashSection />
      <BodySection />
      <ActionSection />
      <FooterSection />
    </>
  );
}
