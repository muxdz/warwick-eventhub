import LoginForm from "@/components/LoginForm";
import Link from "next/link";

export default function LoginPage() {
    return (
        <main className="page-shell-narrow">
            <LoginForm />

            <p className="mt-8 text-center text-sm text-slate-600">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-link">
                    Sign up
                </Link>
            </p>
        </main>
    );
}
