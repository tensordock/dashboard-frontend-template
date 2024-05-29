import Head from '../../components/head';
import SplashSection from './1-splash';
import BodySection from './2-body';
import ActionSection from './3-action';
import FooterSection from './4-footer';

export default function HomePage() {
  return (
    <>
      <Head title={`H100 SXM5's from $2.50/hr`} />
      <SplashSection />
      <BodySection />
      <ActionSection />
      <FooterSection />
    </>
  );
}
