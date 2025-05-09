export default function Loading() {
  const loadingText = "Loading...";
  const loadingCharacters = loadingText.split("");

  return (
    <div className="fixed w-full h-screen bg-cover bg-center -z-50 flex justify-center items-center">
      <p
        className="grid"
        style={{ gridTemplateColumns: `repeat(${loadingText.length}, 1fr)` }}
      >
        {loadingCharacters.map((char, index) => (
          <span
            key={index}
            className="animate-pulse loading-bounce text-4xl text-400 text-center"
            style={{
              animationDelay: `${index * 0.1}s`,
              animationDuration: `${0.2 * loadingText.length}s`,
            }}
          >
            {char}
          </span>
        ))}
      </p>
    </div>
  );
}
