import { useEffect, useState } from "react";
import { GoogleLoginButton } from "./components/GoogleLoginButton";
import JobApplicationForm from "./components/jobApplications/JobApplicationForm";
import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  User,
} from "firebase/auth";
import { auth } from "./firebase";
import { Route, Switch } from "wouter";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).then(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) setUser(user);
        else setUser(null);
        setLoading(false);
      });
      return () => unsubscribe();
    });
  }, []);

  function Router() {
    const [showForm, setShowForm] = useState(false);

    return (
      <>
        {/* Background image */}
        <div></div>

        {/* Main content */}
        <div>
          <h1>Job Application Tracker</h1>
          {/* Welcome user */}
          <div>
            <h2>Welcome, {user!.displayName}!</h2>
            <p>Email: {user!.email}</p>
            <img src={user!.photoURL!} alt="Profile" />
          </div>
          {/* Applications widget */}
          <div>
            <div>
              <button onClick={() => setShowForm(true)}>New Application</button>

              {/* Applications list */}
              <main>
                <Switch>
                  <Route path="/" />
                </Switch>
              </main>
            </div>
          </div>
        </div>

        {/* Form modal */}
        {showForm && <JobApplicationForm onClose={() => setShowForm(false)} />}
      </>
    );
  }

  return (
    <>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : !user ? (
          <GoogleLoginButton onLogin={setUser} />
        ) : (
          <Router />
        )}
      </div>
    </>
  );
}

export default App;
