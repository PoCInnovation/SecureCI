import { Separator } from "@/components/ui/separator";
import { TypographyH3 } from "@/components/ui/typography/h3";
import { ChildrenProps } from "../types/children-props";

const PageTitle = async ({ children }: ChildrenProps) => {
    return (
        <>
            <div className="text-left p-4">
                <TypographyH3>
                    {children}
                </TypographyH3>
            </div>
            <Separator orientation="horizontal" />
        </>
    );
}

export default PageTitle;