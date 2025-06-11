import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}
