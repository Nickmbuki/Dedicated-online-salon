import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { forgotPasswordRequest } from "../api/services";
import { PageTransition } from "../components/PageTransition";
import { useAuth } from "../context/AuthContext";

type AuthForm = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  resetToken: string;
};

export const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "register" | "forgot" | "reset">("login");
  const [resetTokenHint, setResetTokenHint] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const { register: signUp, login, resetPassword, token, isLoading } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm<AuthForm>();
  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPasswordRequest,
    onSuccess: (result) => {
      setResetTokenHint(result.resetToken ?? null);
      setMode("reset");
    }
  });

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = handleSubmit(async (values) => {
    setAuthError(null);
    try {
      if (mode === "login") {
        await login({ email: values.email, password: values.password });
        navigate("/dashboard");
      } else if (mode === "register") {
        await signUp(values);
        navigate("/dashboard");
      } else if (mode === "forgot") {
        await forgotPasswordMutation.mutateAsync({ email: values.email });
      } else {
        await resetPassword({ token: values.resetToken, password: values.password });
        navigate("/dashboard");
      }
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ?? "The server is not responding yet. Please confirm the backend Railway service is deployed and awake."
        : "Something went wrong. Please try again.";
      setAuthError(message);
    }
  });

  return (
    <PageTransition>
      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-16 lg:grid-cols-[0.9fr_1fr]">
        <div className="rounded-lg bg-ink p-8 text-porcelain shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-champagne">Client suite</p>
          <h1 className="mt-3 font-display text-5xl font-semibold">Book, track, and prepare with confidence</h1>
          <p className="mt-5 leading-8 text-porcelain/75">
            Your dashboard keeps appointments clear, secure, and easy to manage.
          </p>
        </div>
        <form className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm sm:p-8" onSubmit={onSubmit}>
          <div className="mb-6 grid grid-cols-2 rounded-full bg-pearl p-1">
            {(["login", "register"] as const).map((item) => (
              <button key={item} className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === item ? "bg-white text-rosewood shadow-sm" : "text-ink/60"}`} type="button" onClick={() => setMode(item)}>
                {item === "login" ? "Login" : "Register"}
              </button>
            ))}
          </div>
          {mode === "register" ? (
            <>
              <label className="field-label">Full name</label>
              <input className="field-input" {...register("fullName", { required: mode === "register" })} />
              <label className="field-label">Phone</label>
              <input className="field-input" {...register("phone")} />
            </>
          ) : null}
          {mode !== "reset" ? (
            <>
              <label className="field-label">Email</label>
              <input className="field-input" type="email" {...register("email", { required: true })} />
            </>
          ) : null}
          {mode === "reset" ? (
            <>
              <label className="field-label">Reset token</label>
              <input className="field-input" {...register("resetToken", { required: true })} defaultValue={resetTokenHint ?? ""} />
              {resetTokenHint ? <p className="mt-2 text-xs text-ink/55">Development reset token loaded automatically. In production this should be delivered by email or SMS.</p> : null}
            </>
          ) : null}
          {mode !== "forgot" ? (
            <>
              <label className="field-label">Password</label>
              <input className="field-input" type="password" {...register("password", { required: true, minLength: 8 })} />
            </>
          ) : null}
          {formState.errors.password ? <p className="mt-2 text-sm text-rosewood">Password must be at least 8 characters.</p> : null}
          {authError ? <p className="mt-4 rounded-lg bg-rosewood/10 p-3 text-sm font-semibold text-rosewood">{authError}</p> : null}
          <button className="mt-6 w-full rounded-full bg-ink px-5 py-3 text-sm font-bold text-porcelain disabled:opacity-50" type="submit" disabled={isLoading || forgotPasswordMutation.isPending}>
            {isLoading || forgotPasswordMutation.isPending
              ? "Please wait..."
              : mode === "login"
                ? "Login"
                : mode === "register"
                  ? "Create account"
                  : mode === "forgot"
                    ? "Send reset instructions"
                    : "Reset password"}
          </button>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm font-semibold text-rosewood">
            {mode !== "forgot" ? (
              <button type="button" onClick={() => setMode("forgot")}>
                Forgot password?
              </button>
            ) : null}
            {mode !== "reset" ? (
              <button type="button" onClick={() => setMode("reset")}>
                I have a reset token
              </button>
            ) : null}
            {mode !== "login" ? (
              <button type="button" onClick={() => setMode("login")}>
                Back to login
              </button>
            ) : null}
          </div>
        </form>
      </section>
    </PageTransition>
  );
};
