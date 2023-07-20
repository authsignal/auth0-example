import { Auth0Provider } from "@auth0/auth0-react";
import { Authsignal } from "@authsignal/browser";
import type { AppProps } from "next/app";
import Router from "next/router";
import { useEffect, useState } from "react";
import "../styles/globals.css";

function App({ Component, pageProps }: AppProps) {
  const [authsignal, setAuthsignal] = useState<Authsignal | undefined>();

  useEffect(() => {
    const client = new Authsignal({
      baseUrl: "https://dev-challenge.authsignal.com/v1",
      tenantId: "90fd262e-f12e-4f08-a92c-ecd94774e692",
    });

    setAuthsignal(client);
  }, []);

  return authsignal ? (
    <Auth0Provider
      domain="dev-xvna46b6.us.auth0.com"
      clientId="8w9zcSW9nW8oH06JvasY7Yhd9TdQ46jO"
      onRedirectCallback={(appState) => {
        Router.replace(appState?.returnTo || "/");
      }}
      authorizationParams={{
        audience: "https://test-api.com",
        redirect_uri: "http://localhost:3000",
        device_id: authsignal.anonymousId,
      }}
    >
      <Component {...pageProps} />
    </Auth0Provider>
  ) : null;
}

export default App;
