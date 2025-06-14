import type { Control, Path } from "react-hook-form";
import { z } from "zod"
import { formSchema } from "@/schemas/formSchema";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Textarea
} from "@/components/ui/textarea"
import {
    Input
} from "@/components/ui/input"


interface ClassNameFieldProps {
    formControl: Control<z.infer<typeof formSchema>>;
    name: Exclude<Path<z.infer<typeof formSchema>>, "date">;
    label: string;
    placeholder: string;
    isTextArea?: boolean;
    className?: string;
}

export const InputTextField = ({ formControl, name, label, placeholder, className, isTextArea = false }: ClassNameFieldProps) => {
    return (
        <FormField
            control={formControl}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        {
                            isTextArea ?
                                <Textarea
                                    placeholder={placeholder}
                                    className={className}
                                    {...field}
                                />
                                :
                                <Input
                                    placeholder={placeholder}
                                    className={className}
                                    type="text"
                                    {...field} />
                        }

                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}