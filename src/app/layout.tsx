import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { FixedPlugin, Layout } from "@/components";
import { UserProvider } from "@/contexts/UserContext";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PAATA.AI - Your Perfect Homework Buddy App",
  description:
    "PAATA.AI is your intelligent homework assistant powered by advanced AI. Get instant, step-by-step solutions to your homework questions, track your learning progress, and excel in your studies with our personalized learning platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
          integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link rel="icon" href="/image/Paata_logo.png" type="image/png" />
        <link rel="shortcut icon" href="/image/Paata_logo.png" type="image/png" />
      </head>
      <body className={roboto.className}>
        <UserProvider>
          <Layout>
            {children}
            <FixedPlugin />
          </Layout>
        </UserProvider>
      </body>
    </html>
  );
}
