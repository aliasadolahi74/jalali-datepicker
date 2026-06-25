import { Footer, Header, Hero } from './Chrome';
import { Playground } from './Playground';

/** Assembles the showcase page. */
export function App() {
  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
      <Header />
      <Hero />
      <Playground />
      <Footer />
    </div>
  );
}
