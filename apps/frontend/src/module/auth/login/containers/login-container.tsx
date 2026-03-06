"use client";

import { LoginForm } from "../../welcome/components/login-form";
import { LoginFormProvider } from "../providers/login-form-provider";

export const LoginContainer = ({
  onBack,
  onGoRegister,
}: {
  onBack: () => void;
  onGoRegister: () => void;
}) => {
  return (
    <div className="w-full max-w-3xl flex justify-center align-center">
      <LoginFormProvider>
        <LoginForm onBack={onBack} onGoRegister={onGoRegister} />
      </LoginFormProvider>
    </div>
  );
};
