import clsx from "clsx";
import { ComponentProps } from "react";
import {
  TextArea as RACTextArea,
  type TextAreaProps as RACTextAreaProps,
} from "react-aria-components";
import { VariantProps, tv } from "tailwind-variants";

const _input = tv({
  // base: "flex h-9 w-full bg-gradient-to-b text-white border-zinc-600 from-zinc-800 to-zinc-900 rounded-md border px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  // base: "flex h-9 w-full text-white border-zinc-600 bg-zinc-800 rounded-md border px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  base: "border-none glint-2 flex h-9 w-full text-white bg-zinc-800 rounded-lg px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  variants: {},
});

type InputVariants = VariantProps<typeof _input>;

interface InputProps extends InputVariants, ComponentProps<"input"> {}

export function Input(props: InputProps) {
  return (
    <input
      {...props}
      className={clsx("block", _input(props), props.className)}
      // style={{ textShadow: "#00000080 0 1px 1px" }}
    />
  );
}

export type TextAreaProps = RACTextAreaProps & InputVariants;

export function TextArea(props: TextAreaProps) {
  return (
    <RACTextArea
      {...props}
      className={clsx("w-full outline-none", _input(props))}
      style={{ textShadow: "#00000080 0 1px 1px" }}
    />
  );
}
