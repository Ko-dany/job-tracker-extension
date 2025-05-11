type RandomBgProps = {
  bgImgUrl: string;
};

export default function RandomBg({ bgImgUrl }: RandomBgProps) {
  return (
    <div
      className="fixed w-full h-screen bg-cover bg-center -z-50 animate-pulse fade-in-custom opacity-0"
      style={{
        backgroundImage: `url(${bgImgUrl})`,
      }}
    ></div>
  );
}
