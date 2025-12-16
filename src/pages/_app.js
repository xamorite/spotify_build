// source/pages/_app.js
import { AuthProvider } from "../auth/useAuth";
import Layout from "../components/layout";
import { PlayerProvider } from "../player/PlayerContext";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <PlayerProvider>
        <Layout className="font-primary">
          <Component {...pageProps} />
        </Layout>
      </PlayerProvider>
    </AuthProvider>
  );
}

