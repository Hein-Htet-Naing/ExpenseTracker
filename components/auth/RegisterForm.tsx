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
import { RegisterFormData } from "@/types/auth";
import { useState } from "react";
import { validateRegister } from "@/lib/validation";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    const validationErrors = validateRegister(formData);
    console.log(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return setErrors(validationErrors);
    }
    try {
      await register(formData);
      router.push("/login");
    } catch (error: any) {
      setErrors({
        submit: error.response.data.message || "Registration failed!",
      });
    }
  };
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Create your account to start tracking expenses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Full Name"
              type="text"
              onChange={handleChange}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

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
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              onChange={handleChange}
              className={errors.confirmPassword ? "border-destructive" : ""}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {errors.submit && (
            <p className="text-sm text-destructive text-center">
              {errors.submit}
            </p>
          )}

          <Button type="submit" className="w-full">
            {isLoading ? "Creating an account..." : "Sign Up"}
          </Button>
        </form>
        <div className="text-center text-sm  mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-primary underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
