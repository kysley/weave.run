import clsx from "clsx";
import { ComponentProps } from "react";

const clsn =
  "h-[36px] py-1 px-2.5 glint-2 w-full leading-none text-sm rounded border-none outline-none bg-gradient-to-b from-zinc-800/80 to-zinc-800 cursor-pointer";
// "h-[36px] py-1 px-2.5 glint-2 bg-zinc-800 w-full leading-none text-sm rounded border-none outline-none cursor-pointer";

type SelectProps = ComponentProps<"select">;
export function Select({ children, ...props }: SelectProps) {
  return (
    <select {...props} className={clsx(clsn, props.className)}>
      {children}
    </select>
  );
}
