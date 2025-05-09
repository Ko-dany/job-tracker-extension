import { createApi } from "unsplash-js";
import { useEffect, useState } from "react";

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

const getRandomBackground = async () => {
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

export default function RandomBackground() {
  const [bgImgUrl, setBgImgUrl] = useState<string | null>(null);

  useEffect(() => {
    getRandomBackground()
      .then((url) => {
        setBgImgUrl(url);
      })
      .catch((error) => {
        console.error("Error fetching random background:", error);
      });
  }, []);

  return (
    <div
      className="fixed w-full h-screen bg-cover bg-center -z-50"
      style={{
        backgroundImage: `url(${bgImgUrl})`,
      }}
    ></div>
  );
}
