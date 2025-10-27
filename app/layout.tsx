import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignedOut, SignIn, SignedIn } from "@clerk/nextjs";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Flux Box - Store Now, Get Later",
  description: "Your personal cloud storage solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${poppins.variable} font-sans antialiased`}>
          <SignedOut>
            <div className="flex h-screen w-full relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-50">
              {/* Animated gradient orbs */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float"></div>
                <div className="absolute top-40 -right-40 w-96 h-96 bg-slate-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float-delay"></div>
                <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float-slow"></div>
              </div>

              {/* Left side - Branding */}
              <div className="flex w-1/2 items-center justify-center relative z-10 px-12">
                <div className="max-w-lg">
                  {/* Logo/Icon */}
                  <div className="mb-12 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div>
                    <span className="text-2xl font-semibold text-slate-900 tracking-tight">
                      flux box
                    </span>
                  </div>

                  {/* Heading */}
                  <h1 className="text-6xl font-bold mb-6 leading-tight text-slate-900">
                    Store Now.
                    <br />
                    <span className="text-slate-800">Get It Later.</span>
                  </h1>

                  {/* Subtitle */}
                  <p className="text-xl text-slate-600 mb-12 leading-relaxed">
                    Your personal cloud storage solution. Simple, fast, and secure.
                  </p>

                  {/* Feature highlights */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/60 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-200/50">
                        <svg
                          className="w-5 h-5 text-slate-900"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                      <span className="text-slate-800 font-medium">
                        Secure & encrypted
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/60 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-200/50">
                        <svg
                          className="w-5 h-5 text-slate-900"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <span className="text-slate-800 font-medium">
                        Lightning-fast
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/60 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-200/50">
                        <svg
                          className="w-5 h-5 text-slate-900"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                          />
                        </svg>
                      </div>
                      <span className="text-slate-800 font-medium">
                        Access anywhere
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Sign In */}
              <div className="flex w-1/2 items-center justify-center relative z-10 px-12">
                <div className="w-full max-w-md">
                  <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-100/50 p-2 border border-white/60">
                    <SignIn routing="hash" />
                  </div>
                </div>
              </div>
            </div>
          </SignedOut>
          <SignedIn>{children}</SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}