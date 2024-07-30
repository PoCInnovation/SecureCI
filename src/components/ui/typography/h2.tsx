import { ChildrenProps } from "@/components/types/ChildrenProps";

const TypographyH2 = ({ children }: ChildrenProps) => {
    return (
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            {children}
        </h2>
    );
}

export { TypographyH2 }