import type { Control } from "react-hook-form";
import { z } from "zod"
import { formSchema } from "@/schemas/formSchema";
import { InputTextField } from "./input-text-field";
import { DateField } from "./date-field";



interface ReviewFormFieldProps {
    formControl: Control<z.infer<typeof formSchema>>;
}

export const ReviewFormField = ({ formControl }: ReviewFormFieldProps) => {
    return (
        <>
            {/* Input Field */}
            <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-4">

                {/* className */}
                <div className="col-span-4">
                    <InputTextField
                        formControl={formControl}
                        name="className"
                        label="Class"
                        placeholder="Python 08:00-10:00"
                    />
                </div>

                {/* Date */}
                <div className="col-span-4">
                    <DateField
                        formControl={formControl}
                        label="Date"
                    />
                </div>

                {/* username */}
                <div className="col-span-4">
                    <InputTextField
                        formControl={formControl}
                        name="username"
                        label="Nong"
                        placeholder="Ning"
                    />
                </div>

            </div>

            {/* topic */}
            <InputTextField
                formControl={formControl}
                name="topic"
                label="Topic"
                placeholder="Discord Bot ..."
                isTextArea={true}
                className="resize-none h-40"
            />

            {/* reviewNong */}
            <InputTextField
                formControl={formControl}
                name="reviewNong"
                label="Review"
                placeholder="ReviewNong"
                isTextArea={true}
                className="resize-none h-60"
            />
        </>
    )
}