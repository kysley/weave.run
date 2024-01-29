import { VariantProps, tv } from "tailwind-variants";

const _input = tv({
  base: "flex items-center gap-2 w-full focus-within:border-accent leading-none shadow-inner text-sm py-1 px-2.5 rounded border",
  variants: {

  },
});

type InputVariants = VariantProps<typeof _input>;

interface InputProps extends InputVariants {
  children: React.ReactNode;
}

export function Input(props: InputProps) {
  return (
    <div className={_input(props)}>
      <input
        className={class="block w-full outline-none"}
        {...props}
        style={{ textShadow: "#00000080 0 1px 1px" }}
      >
        {props.children}
      </input>
    </div>
  );
}
