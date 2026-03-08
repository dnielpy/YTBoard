"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/app/i18n/navigation";
import { connectGoogleAccount } from "@/lib/api/accounts";
import { useTranslations } from "next-intl";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

type CallbackStatus = "processing" | "success" | "error";

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("auth.googleCallback");
  const [status, setStatus] = useState<CallbackStatus>("processing");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      setStatus("error");
      setErrorMessage(error);
      return;
    }

    if (!code) {
      setStatus("error");
      setErrorMessage("No authorization code received");
      return;
    }

    const redirectUri = `${window.location.origin}${window.location.pathname}`;

    connectGoogleAccount({ code, redirect_uri: redirectUri })
      .then(() => {
        setStatus("success");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      })
      .catch((err) => {
        setStatus("error");
        setErrorMessage(err?.detail || err?.message || "Connection failed");
      });
  }, [searchParams, router]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center gap-6 text-center">
        {status === "processing" && (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-[#FF0000]" />
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {t("processing")}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("processingHint")}
              </p>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {t("success")}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("successHint")}
              </p>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="h-12 w-12 text-destructive" />
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {t("error")}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {errorMessage}
              </p>
            </div>
            <button
              type="button"
              className="mt-4 rounded-lg bg-[#FF0000] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#CC0000]"
              onClick={() => router.push("/auth/login")}
            >
              {t("retry")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
