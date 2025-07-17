"use client";
import { useState } from "react";
import { auth } from "../../../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginCard() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading,setLoading] = useState(false)

    const router = useRouter();

    const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
        setLoading(true);
        if (isLogin) {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            toast.success("Logged in successfully");
        } else {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            toast.success("Signed up successfully");
        }
        setLoading(false);
        router.push('/');
    } catch (err: any) {
        console.error(err);
        setLoading(false);
        toast.error(err.message || "Error occurred");
    }
};

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>{isLogin ? "Login to your account" : "Sign up for an account"}</CardTitle>
                    <CardDescription>
                        Enter your email below to {isLogin ? "login" : "create an account"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full">
                                    {isLogin ? "Login" : "Sign Up"}
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            {isLogin ? (
                                <>
                                    Don&apos;t have an account?{" "}
                                    <button type="button" className="underline" onClick={() => setIsLogin(false)}>
                                        Sign up
                                    </button>
                                </>
                            ) : (
                                <>
                                    Already have an account?{" "}
                                    <button type="button" className="underline" onClick={() => setIsLogin(true)}>
                                        Login
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
