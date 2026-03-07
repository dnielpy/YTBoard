"use client";

import { RegisterForm } from "../../welcome/components/register-form";
import { CreateAccountProvider } from "../providers/create-account-provider";

export const RegisterContainer = ({
  onBack,
  onGoLogin,
  onSuccess,
}: {
  onBack: () => void;
  onGoLogin: () => void;
  onSuccess: () => void;
}) => {
  return (
    <div className="w-full max-w-3xl flex justify-center align-center">
      <CreateAccountProvider onSuccess={onSuccess}>
        <RegisterForm onBack={onBack} onGoLogin={onGoLogin} />
      </CreateAccountProvider>
    </div>
  );
};
