import { Stack, type StackProps } from "./stack";

export type FlexProps = StackProps;

/** Row-oriented convenience wrapper over Stack. */
export function Flex(props: FlexProps) {
  return <Stack direction="row" {...props} />;
}
