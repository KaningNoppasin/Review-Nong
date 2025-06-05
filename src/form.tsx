import {
    useEffect,
    useState
} from "react"
import {
    toast
} from "sonner"
import {
    useForm
} from "react-hook-form"
import {
    zodResolver
} from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    cn
} from "@/lib/utils"
import {
    Button
} from "@/components/ui/button"
import {
    Form,
    FormControl,
    // FormDescription,
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
import {
    format
} from "date-fns"
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"
import {
    Calendar
} from "@/components/ui/calendar"
import {
    Calendar as CalendarIcon
} from "lucide-react"
// import {
//     CloudUpload,
//     Paperclip
// } from "lucide-react"
// import {
//     FileInput,
//     FileUploader,
//     FileUploaderContent,
//     FileUploaderItem
// } from "@/components/ui/file-upload"

const formSchema = z.object({
    className: z.string().min(1).max(20),
    date: z.coerce.date(),
    username: z.string().min(1).max(20),
    reviewNong: z.string().min(1).min(0).max(500),
    // selectFile: z.string()
});

export default function MyForm() {
    const [classNameValue, setClassNameValue] = useState<string>("");

    const getValuesFromLocal = () : z.infer<typeof formSchema>[] | [] => {
        const valuesLocal = localStorage.getItem("values");
        return valuesLocal ? JSON.parse(valuesLocal) : []
    }

    const addValuesFromLocal = (values : z.infer<typeof formSchema>) => {
        const valuesLocal = localStorage.getItem("values");
        let parsed: z.infer<typeof formSchema>[] = []

        if (valuesLocal) {
            parsed = JSON.parse(valuesLocal);
        }
        const updated = [...parsed, values];

        // Save back to localStorage
        localStorage.setItem("values", JSON.stringify(updated));
    }

    const resetValuesFromLocal = () => {
        localStorage.setItem("values", JSON.stringify([]));
    }

    const clearFormWithOutClassName = () => {
        const classNameData = sessionStorage.getItem("className") ?? ""

        setClassNameValue(classNameData)
        const prevForm = form.getValues();
        form.reset({
            ...prevForm,
            className: classNameData,
        });
    }

    const clearForm = () => {
        form.reset({
            className: "",
            date: new Date(),
            username: "",
            reviewNong: ""
        });
    }


    useEffect(() => {
        // clearFormWithOutClassName()

        const parsed = getValuesFromLocal()
        console.log(parsed);
    }, [])

    // const [files, setFiles] = useState<File[] | null>(null);

    // const dropZoneConfig = {
    //     maxFiles: 5,
    //     maxSize: 1024 * 1024 * 4,
    //     multiple: true,
    // };
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            "date": new Date(),
            "className": classNameValue
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log(values);
            sessionStorage.setItem("className", values.className);
            addValuesFromLocal(values)
            toast(
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(values, null, 2)}</code>
                </pre>
            );
        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
        }
    }

    return (
        <div className="pl-5 pr-5">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">

                    <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-4">

                        {/* className */}
                        <div className="col-span-4">

                            <FormField
                                control={form.control}
                                name="className"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>ClassName</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Python, Unity , etc."

                                                type="text"
                                                {...field} />
                                        </FormControl>
                                        {/* <FormDescription>This is your public class name.</FormDescription> */}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Date */}
                        <div className="col-span-4">

                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[240px] pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
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
                                        {/* <FormDescription>Your date .</FormDescription> */}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* username */}
                        <div className="col-span-4">

                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="NongNing ..."

                                                type=""
                                                {...field} />
                                        </FormControl>
                                        {/* <FormDescription>This is your public user name.</FormDescription> */}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                    </div>

                    <FormField
                        control={form.control}
                        name="reviewNong"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ReviewNong</FormLabel>
                                <FormControl>
                                    {/* <Input
                                        placeholder="ReviewNong"

                                        type=""
                                        {...field} /> */}
                                    <Textarea
                                        placeholder="ReviewNong"
                                        className="resize-none h-80"
                                        {...field}
                                    />
                                </FormControl>
                                {/* <FormDescription>This is your public ReviewNong.</FormDescription> */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* <FormField
                        control={form.control}
                        name="selectFile"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select File</FormLabel>
                                <FormControl>
                                    <FileUploader
                                        value={files}
                                        onValueChange={setFiles}
                                        dropzoneOptions={dropZoneConfig}
                                        className="relative bg-background rounded-lg p-2"
                                    >
                                        <FileInput
                                            id="fileInput"
                                            className="outline-dashed outline-1 outline-slate-500"
                                        >
                                            <div className="flex items-center justify-center flex-col p-8 w-full ">
                                                <CloudUpload className='text-gray-500 w-10 h-10' />
                                                <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="font-semibold">Click to upload</span>
                                                    &nbsp; or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    SVG, PNG, JPG or GIF
                                                </p>
                                            </div>
                                        </FileInput>
                                        <FileUploaderContent>
                                            {files &&
                                                files.length > 0 &&
                                                files.map((file, i) => (
                                                    <FileUploaderItem key={i} index={i}>
                                                        <Paperclip className="h-4 w-4 stroke-current" />
                                                        <span>{file.name}</span>
                                                    </FileUploaderItem>
                                                ))}
                                        </FileUploaderContent>
                                    </FileUploader>
                                </FormControl>
                                <FormDescription>Select a file to upload.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}
                    <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-4">
                        <Button type="submit" className="col-span-4">Submit</Button>
                        <Button type="button" onClick={resetValuesFromLocal} className="col-span-4">Clear local storage</Button>
                        <Button type="button" onClick={clearForm} className="col-span-4">Clear Form</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}