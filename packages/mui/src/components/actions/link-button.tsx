import { Button, type ButtonProps } from "./button";

export interface LinkButtonProps extends Omit<ButtonProps, "href" | "type"> {
  href: string;
}

/** Semantic alias for Button used as a navigational link. */
export function LinkButton(props: LinkButtonProps) {
  return <Button {...props} />;
}
