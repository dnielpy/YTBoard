"use client";

import { RegisterForm } from "../../welcome/components/register-form";
import { CreateAccountProvider } from "../providers/create-account-provider";

export const RegisterContainer = ({
  onBack,
  onGoLogin,
}: {
  onBack: () => void;
  onGoLogin: () => void;
}) => {
  return (
    <div className="w-full max-w-3xl flex justify-center align-center">
      <CreateAccountProvider>
        <RegisterForm onBack={onBack} onGoLogin={onGoLogin} />
      </CreateAccountProvider>
    </div>
  );
};
