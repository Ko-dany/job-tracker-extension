import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "!bg-white/85 !border-gray-300",
          title: "!text-black",
          description: "!text-gray-900",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
