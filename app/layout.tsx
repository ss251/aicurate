import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'AICurate',
  description: 'Discover, review, and track AI applications',
};

// Dynamically import components that need client-side features
const MiniKitProvider = dynamic(() => import("@/components/minikit-provider"), {
  ssr: false,
});

const NextAuthProvider = dynamic(() => import("@/components/next-auth-provider"), {
  ssr: false,
});

const ErudaProvider = dynamic(
  () => import("../components/Eruda").then((c) => c.ErudaProvider),
  {
    ssr: false,
  }
);

const ErrorBoundary = dynamic(() => import("@/components/error-boundary").then(mod => mod.ErrorBoundary), {
  ssr: false,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-[100dvh] overflow-hidden">
      <body className={`${inter.className} h-full overflow-hidden overscroll-none`}>
        <ErrorBoundary>
          <NextAuthProvider>
            <ErudaProvider>
              <MiniKitProvider>
                <div className="h-full w-full max-w-screen-sm mx-auto bg-white">
                  {children}
                </div>
              </MiniKitProvider>
            </ErudaProvider>
          </NextAuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
