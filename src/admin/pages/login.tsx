import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      window.location.href = "/admin";
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 bg-purple-600 opacity-20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 bg-blue-600 opacity-20 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-purple-400/20 bg-white/10 backdrop-blur-md p-8 shadow-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 mb-4">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <p className="mt-2 text-sm text-purple-200">
              Access Zentriq admin dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-purple-100 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
                <Input
                  type="email"
                  placeholder="admin@zentriq.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 bg-white/10 border-purple-400/30 text-white placeholder:text-purple-300"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-purple-100 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 bg-white/10 border-purple-400/30 text-white placeholder:text-purple-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-purple-400 hover:text-purple-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-purple-200 cursor-pointer">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <a href="#" className="text-purple-300 hover:text-purple-100 transition">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
            >
              {isLoading ? (
                "Signing in..."
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 rounded-lg bg-blue-400/10 border border-blue-400/30">
            <p className="text-xs font-medium text-blue-200 mb-2">Demo Credentials:</p>
            <p className="text-xs text-blue-100">Email: admin@zentriq.com</p>
            <p className="text-xs text-blue-100">Password: demo123456</p>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-purple-200">
            Questions? Contact{" "}
            <a href="mailto:support@zentriq.com" className="text-purple-300 hover:text-purple-100 font-medium">
              support@zentriq.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
