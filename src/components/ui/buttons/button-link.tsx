import { ChildrenProps } from "@/components/types/ChildrenProps"
import { Button } from "./button"

const ButtonLink = ({ children }: ChildrenProps) => {
  return <Button variant="link">{children}</Button>
}

export { ButtonLink }