import { ChildrenProps } from "@/components/types/ChildrenProps";

const TypographyH1 = ({ children }: ChildrenProps) => {
    return (
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {children}
        </h1>
    );
}

export { TypographyH1 }