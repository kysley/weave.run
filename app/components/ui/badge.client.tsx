import { VariantProps, tv } from "tailwind-variants";
import clsx from "clsx";

const _badge = tv({
  base: "-my-0.5 inline-flex items-center gap-x-1.5 rounded-md px-1.5 py-0.5 text-sm/5 font-medium sm:text-xs/5 forced-colors:outline self-start",
  variants: {
    intent: {
      success:
        "bg-emerald-400/20 text-emerald-700 group-data-[hover]:bg-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300 dark:group-data-[hover]:bg-emerald-400/15",
      info: "bg-blue-400/20 text-blue-700 group-data-[hover]:bg-blue-400/30 dark:bg-blue-400/10 dark:text-blue-300 dark:group-data-[hover]:bg-blue-400/15",
      warning:
        "bg-amber-400/20 text-amber-700 group-data-[hover]:bg-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300 dark:group-data-[hover]:bg-amber-400/15",
    },
  },
  defaultVariants: {
    intent: "info",
  },
});

type BadgeVariants = VariantProps<typeof _badge>;

interface BadgeProps extends BadgeVariants {
  children: React.ReactNode;
}

export function Badge(props: BadgeProps) {
  return (
    <div
      {...props}
      className={clsx(_badge(props), props.className)}
      style={{ textShadow: "#00000080 0 1px 1px" }}
    >
      {props.children}
    </div>
  );
}
