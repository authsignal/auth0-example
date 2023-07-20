import {
  Auth0Context,
  Auth0ContextInterface,
  RedirectLoginOptions,
  useAuth0,
} from "@auth0/auth0-react";
import React, { ComponentType, useEffect, FC } from "react";

const defaultOnRedirecting = (): JSX.Element => <></>;

const defaultOnBeforeAuthentication = async (): Promise<void> => {};

const defaultReturnTo = (): string =>
  `${window.location.pathname}${window.location.search}`;

export interface WithAuthenticationRequiredOptions {
  returnTo?: string | (() => string);
  onRedirecting?: () => JSX.Element;
  onBeforeAuthentication?: () => Promise<void>;
  loginOptions?: RedirectLoginOptions;
  context?: React.Context<Auth0ContextInterface>;
}

const withAuthenticationRequired = <P extends object>(
  Component: ComponentType<P>,
  options: WithAuthenticationRequiredOptions = {}
): FC<P> => {
  return function WithAuthenticationRequired(props: P): JSX.Element {
    const {
      returnTo = defaultReturnTo,
      onRedirecting = defaultOnRedirecting,
      onBeforeAuthentication = defaultOnBeforeAuthentication,
      loginOptions,
      context = Auth0Context,
    } = options;

    const { isAuthenticated, isLoading, logout, loginWithRedirect } =
      useAuth0(context);

    useEffect(() => {
      if (isLoading || isAuthenticated) {
        return;
      }
      const opts = {
        ...loginOptions,
        appState: {
          ...(loginOptions && loginOptions.appState),
          returnTo: typeof returnTo === "function" ? returnTo() : returnTo,
        },
      };
      (async (): Promise<void> => {
        await onBeforeAuthentication();

        const url = new URL(window.location.href);

        if (url.searchParams.get("error") === "access_denied") {
          logout();
        } else {
          await loginWithRedirect();
        }
      })();
    }, [
      isLoading,
      isAuthenticated,
      loginOptions,
      returnTo,
      logout,
      loginWithRedirect,
      onBeforeAuthentication,
    ]);

    return isAuthenticated ? <Component {...props} /> : onRedirecting();
  };
};

export default withAuthenticationRequired;
