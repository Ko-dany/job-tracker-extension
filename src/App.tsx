import { useState } from "react";
import { GoogleLoginButton } from "./components/GoogleLoginButton";
import { ApplicationForm } from "./components/ApplicationForm";
import { User } from "firebase/auth";

function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <>
      <div>
        <h1>Job Application Tracker</h1>
        {user ? (
          <ApplicationForm user={user} />
        ) : (
          <GoogleLoginButton onLogin={setUser} />
        )}
      </div>
    </>
  );
}

export default App;
