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
import Clock from "./components/home/clock";
import Greeting from "./components/home/greeting";
import RandomBackground from "./components/home/randomBackground";

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
        <div>
          <RandomBackground />
        </div>

        {/* Main content */}
        <div className="min-h-screen flex flex-col justify-center items-center">
          {/* Clock widget */}
          <Clock />
          {/* Welcome user */}
          <Greeting userName={user!.displayName} />
          {/* Applications widget */}
          <div>
            <div>
              <button onClick={() => setShowForm(true)} className="form-button">
                New Application
              </button>

              {/* Applications list */}
              <main>
                <Switch>
                  <Route path="/" />
                </Switch>
              </main>
            </div>
          </div>
        </div>

        {/* Job Application Form modal */}
        {showForm && (
          <JobApplicationForm onClose={() => setShowForm(false)} user={user} />
        )}
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
