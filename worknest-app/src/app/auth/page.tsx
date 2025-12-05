"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, Suspense } from "react";
import { signIn, signUp } from "@/lib/auth-client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, Users, CheckCircle2, Sparkles, Mail, Lock, User } from "lucide-react";

function SignInContent() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState("");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const callbackURL = redirect || "/dashboard";

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
        callbackURL,
      });

      if (result.error) {
        setError(result.error.message || "Failed to sign in");
      } else {
        router.push(callbackURL);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signUp.email({
        email,
        password,
        name,
        callbackURL,
      });

      if (result.error) {
        setError(result.error.message || "Failed to sign up");
      } else {
        router.push(callbackURL);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-primary">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-orange-300 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-40 w-72 h-72 bg-purple-300 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-5xl animate-glow">👻</span>
              <h1 className="text-3xl font-bold">GhostNet</h1>
            </div>
            <p className="text-orange-100 text-lg">Your spooky workspace, haunted with productivity. 🎃</p>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold mb-6 leading-tight">
                Haunt your tasks,<br />bewitch your team
              </h2>
              <p className="text-orange-100 text-lg max-w-md">
                Summon productivity from the shadows. Manage tasks, track progress, and conjure amazing results together.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Users, text: "Spectral team collaboration" },
                { icon: CheckCircle2, text: "Bewitching task management" },
                { icon: Sparkles, text: "Hauntingly beautiful interface" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-orange-50">
                  <div className="h-10 w-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <span className="text-lg">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-orange-200 text-sm">
            © 2024 GhostNet. All rights reserved. 👻
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-5xl animate-pulse-glow">👻</span>
              <h1 className="text-3xl font-bold">GhostNet</h1>
            </div>
            <p className="text-muted-foreground">Your spooky workspace 🎃</p>
          </div>

          <Card className="border-2 shadow-xl">
            <CardHeader className="space-y-1 pb-4">
              {/* Mode Switcher */}
              <div className="flex gap-2 mb-4 p-1 bg-muted rounded-lg">
                <button
                  onClick={() => {
                    setMode("signin");
                    setError("");
                  }}
                  className={cn(
                    "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all",
                    mode === "signin"
                      ? "bg-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMode("signup");
                    setError("");
                  }}
                  className={cn(
                    "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all",
                    mode === "signup"
                      ? "bg-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Sign Up
                </button>
              </div>

              <CardTitle className="text-2xl font-bold">
                {mode === "signin" ? "Welcome back" : "Create account"}
              </CardTitle>
              <CardDescription className="text-base">
                {mode === "signin"
                  ? "Sign in to your account to continue"
                  : "Sign up to get started with GhostNet"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Email/Password Form */}
              <form onSubmit={mode === "signin" ? handleEmailSignIn : handleEmailSignUp} className="space-y-4">
                {mode === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="pl-10 h-12"
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 h-12"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="pl-10 h-12"
                      disabled={loading}
                    />
                  </div>
                  {mode === "signup" && (
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 8 characters
                    </p>
                  )}
                </div>

                {error && (
                  <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    mode === "signin" ? "Sign In" : "Sign Up"
                  )}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Sign In Buttons */}
              <Button
                variant="outline"
                className="w-full h-12 text-base font-medium hover:bg-accent hover:scale-[1.02] transition-all duration-200"
                disabled={loading}
                onClick={async () => {
                  await signIn.social(
                    {
                      provider: "google",
                      callbackURL
                    },
                    {
                      onRequest: () => setLoading(true),
                      onResponse: () => setLoading(false),
                    },
                  );
                }}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 262" className="mr-2">
                      <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                      <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                      <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"></path>
                      <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 text-base font-medium hover:bg-accent hover:scale-[1.02] transition-all duration-200"
                disabled={loading}
                onClick={async () => {
                  await signIn.social(
                    {
                      provider: "github",
                      callbackURL
                    },
                    {
                      onRequest: () => setLoading(true),
                      onResponse: () => setLoading(false),
                    },
                  );
                }}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      className="mr-2"
                    >
                      <path
                        fill="currentColor"
                        d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
                      ></path>
                    </svg>
                    Continue with GitHub
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground px-4 pt-4">
                By continuing, you agree to our{" "}
                <Link href="#" className="underline hover:text-foreground transition-colors">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="underline hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </p>

              <div className="pt-4 border-t">
                <p className="text-center text-xs text-muted-foreground">
                  Powered by{" "}
                  <Link
                    href="https://better-auth.com"
                    className="underline hover:text-foreground transition-colors"
                    target="_blank"
                  >
                    Better Auth
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}