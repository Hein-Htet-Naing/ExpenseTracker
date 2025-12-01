"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LoginFormData } from "@/types/auth";
import { useState } from "react";
import { validateLogin } from "@/lib/validation";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  //handling user submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateLogin(formData);
    if (Object.keys(validationErrors).length > 0) {
      return setErrors(validationErrors);
    }
    try {
      await login(formData);
      router.push("/dashboard");
    } catch (error: any) {
      setErrors({
        submit:
          error?.response?.data?.message || "Login failed. Please try again.",
      });
    }
  };
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              placeholder="Email"
              type="email"
              onChange={handleChange}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              placeholder="Password"
              type="password"
              onChange={handleChange}
              className={errors.password ? "border-destructive" : ""}
            />

            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          {errors.submit && (
            <p className="text-sm text-destructive text-center">
              {errors.submit}
            </p>
          )}

          <Button type="submit" className="w-full">
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <div className="text-center text-sm  mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary underline">
            Sign Up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
