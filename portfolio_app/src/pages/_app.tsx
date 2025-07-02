// import '../styles/globals.css';
// import type { AppProps } from 'next/app';
// import Navbar from '../components/layout/Navbar';
// import Footer from '../components/layout/Footer';

// export default function App({ Component, pageProps }: AppProps) {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar />
//       <main className="flex-grow">
//         <Component {...pageProps} />
//       </main>
//       <Footer />
//     </div>
//   );
// }



// pages/_app.tsx
import { useEffect } from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import * as gtag from "../../lib/gtag";
import '../styles/globals.css';


export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router.events]);

  return <Component {...pageProps} />;
}
