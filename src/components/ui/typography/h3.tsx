import { ChildrenProps } from "@/components/types/ChildrenProps";

const TypographyH3 = ({ children }: ChildrenProps) => {
    return (
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {children}
        </h3>
    );
}

export { TypographyH3 }