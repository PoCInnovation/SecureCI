import { ChildrenProps } from "@/components/types/ChildrenProps";

const TypographyP = ({ children }: ChildrenProps) => {
    return (
        <p className="leading-7 [&:not(:first-child)]:mt-6">
            {children}
        </p>
    );
}

export { TypographyP };