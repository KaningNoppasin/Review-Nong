import type { Control } from "react-hook-form";
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
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"
import {
    Calendar
} from "@/components/ui/calendar"
import {
    Button
} from "@/components/ui/button"
import {
    cn
} from "@/lib/utils"
import {
    format
} from "date-fns"
import {
    Calendar as CalendarIcon
} from "lucide-react"


interface DateFieldProps {
    formControl: Control<z.infer<typeof formSchema>>;
    label: string;
}

export const DateField = ({ formControl, label }: DateFieldProps) => {
    return (
        <FormField
            control={formControl}
            name="date"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        // "w-[240px] pl-3 text-left font-normal",
                                        "text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    {field.value ? (
                                        format(field.value, "ccc d LLL Y")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}