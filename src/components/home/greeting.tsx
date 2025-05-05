import { useEffect, useState } from "react";

type GreetingProps = {
  userName: string | null;
};

export default function Greeting({ userName }: GreetingProps) {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    if (hours >= 5 && hours < 12) setGreeting("Good Morning");
    else if (hours >= 12 && hours < 17) setGreeting("Good Afternoon");
    else if (hours >= 17 && hours < 5) setGreeting("Good Evening");
  }, []);

  return (
    <div className="main-greeting mb-5">
      {greeting}, {userName}.
    </div>
  );
}
