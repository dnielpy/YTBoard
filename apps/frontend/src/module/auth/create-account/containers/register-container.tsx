"use client";

import { RegisterForm } from "../../welcome/components/register-form";

export const RegisterContainer = ({
  onBack,
  onGoLogin,
}: {
  onBack: () => void;
  onGoLogin: () => void;
}) => {
  return (
    <div className="w-full max-w-3xl flex justify-center align-center">
      <RegisterForm onBack={onBack} onGoLogin={onGoLogin} />
    </div>
  );
};
