import { VariantProps, tv } from "tailwind-variants";
import clsx from "clsx";

// const _card = tv({
//   base: "glint squish py-1.5 px-2.5 rounded border bg-gradient-to-b font-semibold leading-none text-white text-sm",
//   variants: {
//     isLoading: {
//       true: "opacity-50 pointer-events-none",
//     },
//     variant: {
//       primary: "border-sky-800 from-sky-500 to-sky-600",
//       secondary: "border-accent-800 from-accent-500 to-accent-600",
//       tertiary: "border-gray-600 from-gray-400 to-gray-500",
//     },
//     intent: {
//       danger: "border-rose-800 from-rose-500 to-rose-600",
//       success: "border-green-800 from-green-500 to-green-600",
//     },
//   },
//   defaultVariants: {
//     variant: "primary",
//     intent: undefined,
//   },
// });

// type CardVariants = VariantProps<typeof _card>;

// interface CardProps extends CardVariants {
//   children: React.ReactNode;
// }

export function Card(props: any) {
  return (
    <div
      {...props}
      className={clsx(
        "grid justify-items-center overflow-hidden place-items-center p-6 py-8 sm:p-8 lg:p-12 relative rounded-xl bg-white shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)] dark:bg-zinc-900 dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)] dark:before:pointer-events-none dark:before:absolute dark:before:-inset-px dark:before:rounded-xl dark:before:shadow-[0px_2px_8px_0px_rgba(0,_0,_0,_0.20),_0px_1px_0px_0px_rgba(255,_255,_255,_0.06)_inset] forced-colors:outline",
        props.className
      )}
    >
      {props.children}
    </div>
  );
}
