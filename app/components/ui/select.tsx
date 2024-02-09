import clsx from "clsx";
import { ComponentProps } from "react";

const clsn =
  "h-[36px] py-1 px-2.5 glint w-full leading-none text-sm rounded border border-zinc-600 outline-none bg-gradient-to-b from-zinc-700 to-zinc-800 cursor-pointer";

type SelectProps = ComponentProps<"select">;
export function Select({ children, ...props }: SelectProps) {
  return (
    <select {...props} className={clsx(clsn, props.className)}>
      {children}
    </select>
  );
}
