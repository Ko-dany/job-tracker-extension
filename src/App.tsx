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
// import Clock from "./components/home/clock";
// import Greeting from "./components/home/greeting";
import RandomBg from "./components/home/randomBg";
import Loading from "./components/home/loading";
import { createApi } from "unsplash-js";
import JobApplicationList from "./components/jobApplications/JobApplicationList";

const unsplash = createApi({
  accessKey: import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
});

type UnsplashImage = {
  id: string;
  urls: {
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  description: string;
};

const getRandomBg = async () => {
  const res = await unsplash.photos.getRandom({
    query: "landscape",
  });
  if (res.type === "success") {
    const response = res.response as UnsplashImage;
    return response.urls?.full;
  } else {
    throw new Error("Error fetching random background");
  }
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [bgImgUrl, setBgImgUrl] = useState<string | null>(null);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).then(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) setUser(user);
        else setUser(null);

        console.log("User state changed:", user);
      });
      return () => unsubscribe();
    });
  }, []);

  useEffect(() => {
    const fetchRandomBg = async () => {
      await getRandomBg()
        .then((url) => {
          setBgImgUrl(url);
        })
        .catch((error) => {
          setBgImgUrl("https://picsum.photos/1080"); // Test
          console.error("Error fetching random background:", error);
        });
    };

    fetchRandomBg();
  }, []);

  useEffect(() => {
    if (bgImgUrl === null) return;
    setLoading(!bgImgUrl);
  }, [bgImgUrl]);

  function Router() {
    const [showForm, setShowForm] = useState(false);

    return (
      <>
        <Switch>
          <Route path="/" />
        </Switch>

        {/* Background image */}
        <div>
          <RandomBg bgImgUrl={bgImgUrl!} />
        </div>

        {/* Main content */}
        <div
          className="min-h-screen flex flex-col justify-center items-center animate-pulse fade-in-custom opacity-0"
          style={{
            animationDelay: "0.7s",
          }}
        >
          {/* Clock widget */}
          {/* <Clock /> */}
          {user ? (
            <>
              {/* Welcome user */}
              {/* <Greeting userName={user!.displayName} /> */}
              {/* Applications widget */}
              <div>
                <div>
                  {user ? (
                    <button
                      onClick={() => setShowForm(true)}
                      className="form-button"
                    >
                      New Application
                    </button>
                  ) : (
                    <GoogleLoginButton onLogin={setUser} />
                  )}

                  {/* Applications list */}
                  <main>
                    <JobApplicationList user={user} />
                  </main>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <div>
                  <GoogleLoginButton onLogin={setUser} />
                </div>
              </div>
            </>
          )}
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
      <div>{!loading ? <Router /> : <Loading />}</div>
    </>
  );
}

export default App;
