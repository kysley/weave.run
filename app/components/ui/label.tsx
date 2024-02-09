import clsx from "clsx";
import { HTMLProps, ReactNode } from "react";

type LabelProps = HTMLProps<HTMLLabelElement> & {
  children: ReactNode;
};

export function Label({ children, ...props }: LabelProps) {
  return (
    <label
      {...props}
      className={clsx(
        "pb-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        props.className
      )}
    >
      {children}
    </label>
  );
}
