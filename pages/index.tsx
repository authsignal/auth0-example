import { useAuth0 } from "@auth0/auth0-react";
import withAuthenticationRequired from "./components/withAuthenticationRequired";

function HomePage() {
  const { user, logout } = useAuth0();

  return (
    <main>
      <section>
        <h1>My Example App</h1>
        <div>Signed in as: {user?.name}</div>
        <button
          onClick={() =>
            logout({ logoutParams: { returnTo: process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URL } })
          }
        >
          Sign out
        </button>
      </section>
    </main>
  );
}

export default withAuthenticationRequired(HomePage, {
  onRedirecting: () => (
    <main>
      <section>
        <h1>Loading...</h1>
      </section>
    </main>
  ),
});
