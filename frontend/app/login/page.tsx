import LoginForm from "@/components/LoginForm";
import Link from "next/link";

export default function LoginPage() {
    return (
        <main>
            <LoginForm />

            <p className="mt-8 text-center text-sm text-slate-600">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-500">
                    Sign up
                </Link>
            </p>
        </main>
    );
}