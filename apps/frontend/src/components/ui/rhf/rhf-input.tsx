import {
  ControllerRenderProps,
  FieldValues,
  useFormContext,
} from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";
import { InputField } from "../fields/input-field";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface Props {
  name: string;
  label: string;
  description: string;

  placeholder: string;
  disabled: boolean;
  required: boolean;
  type?: React.HTMLInputTypeAttribute;
  startIcon?: LucideIcon;
  onValueChange?: (value: string) => string | undefined;
  endComponent?: ReactNode;
  min?: number;
  max?: number;
  uppercase?: boolean;
}

export const RHFInput = ({
  name,
  label,
  required,
  placeholder,
  disabled,
  startIcon: StartIcon,
  type,
  onValueChange,
  endComponent,
  min,
  max,
  uppercase,
  description,
}: Props) => {
  const form = useFormContext();

  const handleChange = (
    field: ControllerRenderProps<FieldValues, string>,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let value = e.target.value;
    if (uppercase) value = value.toUpperCase();

    if (onValueChange) {
      const result = onValueChange(value);
      if (result === undefined) return;
      value = result;
    }
    switch (type) {
      case "number": {
        field.onChange(+value);
        break;
      }
      case "tel": {
        if (!/^\+?\d*$/.test(value)) return;
        field.onChange(value);
        break;
      }
      default: {
        field.onChange(value);
      }
    }
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel>
              {label}
              {label && <span>*</span>}
            </FormLabel>
          )}
          <FormControl>
            <InputField
              required={required}
              placeholder={placeholder}
              disabled={disabled}
              {...field}
              className={cn(StartIcon && "pl-8")}
              type={type}
              value={type === "file" ? undefined : field.value}
              startIcon={StartIcon}
              onChange={(e) => {
                if (type === "file") {
                  const file = e.target.files?.[0] || null;
                  if (file) {
                    field.onChange(file);
                  }
                } else {
                  handleChange(field, e);
                }
              }}
              endComponent={endComponent}
              min={min}
              max={max}
            ></InputField>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage className="whitespace-normal break-words" />
        </FormItem>
      )}
    ></FormField>
  );
};
