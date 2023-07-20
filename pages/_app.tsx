import { Auth0Provider } from "@auth0/auth0-react";
import { Authsignal } from "@authsignal/browser";
import type { AppProps } from "next/app";
import Router from "next/router";
import { useEffect, useState } from "react";
import "../styles/globals.css";

// Authsignal
const baseUrl = process.env.NEXT_PUBLIC_AUTHSIGNAL_CLIENT_URL!;
const tenantId = process.env.NEXT_PUBLIC_AUTHSIGNAL_TENANT_ID!;

// Auth0
const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN!;
const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!;
const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE!;
const redirectUrl = process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URL!;

function App({ Component, pageProps }: AppProps) {
  const [authsignal, setAuthsignal] = useState<Authsignal | undefined>();

  useEffect(() => {
    setAuthsignal(new Authsignal({ baseUrl, tenantId }));
  }, []);

  return authsignal ? (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      onRedirectCallback={(appState) => {
        Router.replace(appState?.returnTo || "/");
      }}
      authorizationParams={{
        audience,
        redirect_uri: redirectUrl,
        device_id: authsignal.anonymousId,
      }}
    >
      <Component {...pageProps} />
    </Auth0Provider>
  ) : null;
}

export default App;
