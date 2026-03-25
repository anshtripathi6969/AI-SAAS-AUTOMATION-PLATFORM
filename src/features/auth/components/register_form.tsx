"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const registerSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [shake, setShake] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const signInGithub = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/workflows",
    }, {
      onSuccess: () => {
        router.push("/workflows");
      },
      onError: (ctx) => {
        toast.error(ctx.error.message || "Something went wrong");
      },
    });
  };

  const isPending = form.formState.isSubmitting;
  const emailValue = form.watch("email");
  const isEmailValid = registerSchema.shape.email.safeParse(emailValue).success;

  const onSubmit = async (values: RegisterFormValues) => {
    await authClient.signUp.email(
      {
        name: values.email,
        email: values.email,
        password: values.password,
        callbackURL: "/workflows",
      },
      {
        onSuccess: () => router.push("/workflows"),
        onError: (ctx) => {
          toast.error(ctx.error.message);
          setShake(true);
          setTimeout(() => setShake(false), 400);
        },
      }
    );
  };

  return (
    <div className="relative z-20 flex min-h-screen items-center justify-center px-4 py-20">
      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          x: shake ? [-6, 6, -4, 4, 0] : 0,
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Glow effect matching the landing page cards */}
        <div className="absolute inset-0 rounded-[2rem] bg-purple-500/10 blur-3xl -z-10" />
        
        <Card className="border-white/5 bg-[#0a0a0c]/40 backdrop-blur-[40px] shadow-2xl rounded-[2rem] overflow-hidden">
          <CardHeader className="text-center pb-2 pt-10">
            {/* BRAND LOGO SLOTS IN HERE */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center justify-center gap-2 mb-4 group"
            >
              <div className="relative">
                <Globe className="w-6 h-6 text-indigo-500 relative z-10" />
                <div className="absolute inset-x-0 bottom-0 h-2 bg-indigo-500/20 blur-md rounded-full" />
              </div>
              <span className="text-lg font-black tracking-tighter text-white">
                Fluxion <span className="text-indigo-400">AI</span>
              </span>
            </motion.div>

            <CardTitle className="text-3xl font-black text-white tracking-tight">
              Get started
            </CardTitle>
            <CardDescription className="text-slate-400 font-medium">
              Create your account to start automating
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 pb-10">
            {/* OAUTH SECTION */}
            <div className="mb-8">
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={signInGithub}
                  variant="outline"
                  type="button"
                  disabled={isPending}
                  className="flex w-full h-12 items-center justify-center gap-3 border-white/5 bg-white/[0.03] text-white hover:bg-white/[0.08] hover:border-white/10 transition-all rounded-xl font-semibold shadow-lg group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Image
                    alt="Github"
                    src="/logos/github.svg"
                    width={20}
                    height={20}
                    className="brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  <span className="relative z-10">Continue with Github</span>
                </Button>
              </motion.div>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/5" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-widest font-bold text-slate-500">
                <span className="bg-[#0a0a0c]/0 px-3 backdrop-blur-md">Or continue with</span>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 font-semibold ml-1">Email address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="name@example.com"
                          className="h-12 bg-white/[0.03] border-white/5 text-white placeholder:text-slate-600 rounded-xl focus:border-purple-500/50 focus:ring-purple-500/20 transition-all"
                        />
                      </FormControl>
                      <FormMessage className="text-rose-500 ml-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 font-semibold ml-1">Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="••••••••"
                          className="h-12 bg-white/[0.03] border-white/5 text-white placeholder:text-slate-600 rounded-xl focus:border-purple-500/50 focus:ring-purple-500/20 transition-all"
                        />
                      </FormControl>
                      <FormMessage className="text-rose-500 ml-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 font-semibold ml-1">Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="••••••••"
                          className="h-12 bg-white/[0.03] border-white/5 text-white placeholder:text-slate-600 rounded-xl focus:border-purple-500/50 focus:ring-purple-500/20 transition-all"
                        />
                      </FormControl>
                      <FormMessage className="text-rose-500 ml-1" />
                    </FormItem>
                  )}
                />

                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="pt-2">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="group relative w-full h-12 rounded-xl text-[15px] font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 shadow-[0_0_30px_-10px_rgba(168,85,247,0.5)] hover:shadow-[0_0_50px_-10px_rgba(168,85,247,0.7)] bg-[length:200%_auto] hover:bg-[position:right_center]"
                  >
                    {isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      "Sign up"
                    )}
                    <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
                  </Button>
                </motion.div>
              </form>
            </Form>

            <p className="mt-8 text-center text-[15px] text-slate-500 font-medium">
              Already have an account?{" "}
              <Link href="/login" className="text-white font-bold hover:underline transition-all underline-offset-4">
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
