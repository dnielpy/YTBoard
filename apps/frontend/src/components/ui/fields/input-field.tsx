"use client";

import { FC, ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Label } from "../label";
import { cn } from "@/lib/utils";
import { Input } from "../input";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name?: string;
  label?: string;
  description?: string;
  startIcon?: LucideIcon;
  error?: string | null;
  endComponent?: ReactNode;
}

export const InputField: FC<Props> = ({
  name,
  label,
  description,
  required,
  disabled,
  startIcon: StartIcon,
  type = "text",
  className,
  error,
  endComponent,
  ...rest
}) => {
  return (
    <div>
      {label && (
        <Label className={cn(disabled && "text-muted-foreground")}>
          {label}
          {required && <span>*</span>}
        </Label>
      )}

      <div className="relative">
        {StartIcon && (
          <StartIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
        <Input
          name={name}
          aria-invalid={!!error}
          required={required}
          placeholder={rest.placeholder}
          disabled={disabled}
          className={cn(
            StartIcon && "pl-8",
            endComponent && "pr-18",
            className,
          )}
          type={type}
          {...rest}
        />
        {endComponent && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            {endComponent}
          </div>
        )}
      </div>

      {description && (
        <div className="text-sm text-muted-foreground mt-1">{description}</div>
      )}
    </div>
  );
};
