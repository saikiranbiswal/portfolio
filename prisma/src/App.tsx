import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Features } from './sections/Features';

export default function App() {
  return (
    <main className="bg-paper">
      <Hero />
      <About />
      <Features />
    </main>
  );
}
