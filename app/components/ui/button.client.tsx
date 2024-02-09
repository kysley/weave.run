import {
  Button as RACButton,
  type ButtonProps as RACButtonProps,
} from "react-aria-components";
import { VariantProps, tv } from "tailwind-variants";
import clsx from "clsx";

const _button = tv({
  base: "glint enabled:squish h-[36px] py-1.5 px-2.5 rounded border bg-gradient-to-b font-semibold leading-none text-white text-sm disabled:cursor-not-allowed disabled:opacity-75",
  variants: {
    isLoading: {
      true: "opacity-50 pointer-events-none",
    },
    variant: {
      primary: "border-sky-800 from-sky-500 to-sky-600",
      secondary: "border-accent-800 from-accent-500 to-accent-600",
      tertiary: "border-gray-600 from-gray-400 to-gray-500",
    },
    intent: {
      danger: "border-rose-800 from-rose-500 to-rose-600",
      success: "border-green-800 from-green-500 to-green-600",
      warning: "border-amber-800 from-amber-500 to-amber-600",
    },
  },
  defaultVariants: {
    variant: "primary",
    intent: undefined,
  },
});

type ButtonVariants = VariantProps<typeof _button>;

interface ButtonProps
  extends ButtonVariants,
    Omit<RACButtonProps, "className"> {
  children: React.ReactNode;
  // Enforce this for now.
  className?: string;
}

export function Button(props: ButtonProps) {
  return (
    <RACButton
      {...props}
      className={clsx(_button(props), props.className)}
      type="button"
      style={{ textShadow: "#00000080 0 1px 1px" }}
    >
      {props.children}
    </RACButton>
  );
}
