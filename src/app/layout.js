import "./globals.css";

export const metadata = {
  title: "My Next.js App",
  description: "A Next.js app using the new App Router",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
