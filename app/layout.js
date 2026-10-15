import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/roboto/latin-700.css";
import "@fontsource/lora/latin-700.css";
import "@fontsource/plus-jakarta-sans/latin-500.css";
import "@fontsource/plus-jakarta-sans/latin-600.css";
import "@fontsource/plus-jakarta-sans/latin-700.css";
import "@fontsource/caveat/latin-600.css";
import "./globals.css";

export const metadata = {
  title: "CampusPe — Connect 10X Faster",
  description:
    "One platform connecting students, colleges & employers — faster. Explore colleges, find opportunities, and connect with the right talent.",
  icons: { icon: "/assets/1-1025.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
