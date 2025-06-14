import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";

interface AlertProps {
    buttonLabel: string;
    title: string;
    description?: string;
    variant?: VariantProps<typeof buttonVariants>["variant"]
    handelCancel?: () => void;
    handelContinue?: () => void;
}

export const AlertDialogButton = ({ buttonLabel, title, description,variant, handelCancel, handelContinue }: AlertProps) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={variant}>{buttonLabel}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handelCancel}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handelContinue}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
