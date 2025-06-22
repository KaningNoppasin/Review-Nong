import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AlertProps {
    title: string;
    description?: string;
    open: boolean;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;

    handelCancel?: () => void;
    handelContinue?: () => void;
}

export const AlertDialogButton = ({ title, description, open, onOpenChange, handelCancel, handelContinue }: AlertProps) => {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            {/* <AlertDialogTrigger asChild>
                <Button variant={variant}>{buttonLabel}</Button>
            </AlertDialogTrigger> */}
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
