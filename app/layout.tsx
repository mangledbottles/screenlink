import "./css/style.css";

import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import AuthProvider, { AuthUser } from "./authProvider";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Suspense } from "react";
import { PHProvider, PostHogPageview } from "./posthogProvider";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const hkgrotesk = localFont({
  src: [
    {
      path: "../public/fonts/HKGrotesk-Medium.woff2",
      weight: "500",
    },
    {
      path: "../public/fonts/HKGrotesk-Bold.woff2",
      weight: "700",
    },
    {
      path: "../public/fonts/HKGrotesk-ExtraBold.woff2",
      weight: "800",
    },
  ],
  variable: "--font-hkgrotesk",
  display: "swap",
});

export const metadata = {
  title: "ScreenLink",
  description: "Record a screen capture video and share it easily.",
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-pricing-table": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en">
        <body
          className={`${inter.variable} ${hkgrotesk.variable} font-inter antialiased bg-slate-900 text-slate-200 tracking-tight overflow-x-hidden`}
        >
          <div className="flex flex-col min-h-screen overflow-hidden">
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <PHProvider>{children}</PHProvider>
            </ThemeProvider>
          </div>
          <Suspense>
            <AuthUser />
            <PostHogPageview />
          </Suspense>
          <Toaster />
          <Analytics />
          <script
            defer={true}
            data-domain="screenlink.io"
            src="https://analytics.dermot.email/js/script.js"
          ></script>
          <script
            async
            src="https://js.stripe.com/v3/pricing-table.js"
            defer={true}
          ></script>
          <Script defer={true} strategy="lazyOnload">
            {`
          var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
          (function(){
          var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
          s1.async=true;
          s1.src='https://embed.tawk.to/658dd45307843602b8065588/1hip0aq93';
          s1.charset='UTF-8';
          s1.setAttribute('crossorigin','*');
          s0.parentNode.insertBefore(s1,s0);
          })();
    `}
          </Script>
        </body>
      </html>
    </AuthProvider>
  );
}
