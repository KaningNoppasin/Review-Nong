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
import {
    Button
} from "@/components/ui/button"
import {
    Form
} from "@/components/ui/form"
import { User, Copy } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Table,
    TableBody,
    // TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { z } from "zod"
import { formSchema } from "@/schemas/formSchema";
import { InputTextField } from "./components/form/input-text-field"
import { DateField } from "./components/form/date-field"
import { AlertDialogButton } from './components/dialog/alert-dialog-button';

export default function MyForm() {

    const getFormDataList = (): z.infer<typeof formSchema>[] | [] => {
        const formDataListLocal = localStorage.getItem("formDataList");
        return formDataListLocal ? JSON.parse(formDataListLocal) : []
    }

    const addFormDataList = (values: z.infer<typeof formSchema>) => {
        const formDataListLocal = getFormDataList()
        setFormDataList([...formDataListLocal, values])
    }

    const resetFormDataList = () => {
        toast("Clear local storage !")
        setFormDataList([])
    }

    const clearFormWithOutClassNameAndTopic = () => {
        const classNameSession = sessionStorage.getItem("className") ?? ""
        const topicSession = sessionStorage.getItem("topic") ?? ""

        setClassNameData(classNameSession)
        setTopicData(topicSession)

        form.reset({
            className: classNameSession,
            date: new Date(),
            username: "",
            topic: topicSession,
            reviewNong: ""
        });
    }

    const clearForm = () => {
        form.reset({
            className: "",
            date: new Date(),
            username: "",
            topic: "",
            reviewNong: "",
        });
    }

    const getDateFormat = (date: Date): string => {
        const new_date = new Date(date)
        const parts = new_date.toLocaleDateString("en-GB", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        }).replace(",", "").split(" ");

        const [weekday, day, month, year] = parts;
        return `${weekday} ${day} ${month} ${year}`;
    }

    const formatSingleReviewText = (formData: z.infer<typeof formSchema>): string => {
        return `
${getDateFormat(formData.date)}
${formData.className}
Topic:
${formData.topic}

Nong: ${formData.username}

Review:
${formData.reviewNong}
------------------------------
`
    }

    // const compileAllReviewText = () => {
    //     let reviewText: string = ""
    //     formDataList.map((formData: z.infer<typeof formSchema>) => (
    //         reviewText += formatSingleReviewText(formData)
    //     ))
    //     return reviewText
    // }

    const handleClipboard = async (formData: z.infer<typeof formSchema>, index: number) => {
        try {
            await navigator.clipboard.writeText(formatSingleReviewText(formData));
            console.log('Text copied to clipboard');
            toast("Copied !")

            setCopiedList(prev => {
                const newCopiedList = [...prev];
                newCopiedList[index] = true;
                return newCopiedList;
            });

        } catch (error) {
            console.error('Failed to copy text: ', error);
        }
    };


    const [classNameData, setClassNameData] = useState<string>("");
    const [topicData, setTopicData] = useState<string>("");
    const [formDataList, setFormDataList] = useState<z.infer<typeof formSchema>[]>(getFormDataList());
    const [copiedList, setCopiedList] = useState<boolean[]>([false]);

    useEffect(() => {
        localStorage.setItem("formDataList", JSON.stringify(formDataList));
    }, [formDataList])

    useEffect(() => {
        clearFormWithOutClassNameAndTopic()
    }, [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            "date": new Date(),
            "className": classNameData,
            "topic": topicData
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log(values);
            sessionStorage.setItem("className", values.className);
            sessionStorage.setItem("topic", values.topic);
            addFormDataList(values)
            clearFormWithOutClassNameAndTopic()
            toast("Success")
            // toast(
            //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            //         <code className="text-white">{JSON.stringify(values, null, 2)}</code>
            //     </pre>
            // );
        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
        }
    }

    return (
        <div className="pl-5 pr-5">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">

                    {/* Input Field */}
                    <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-4">

                        {/* className */}
                        <div className="col-span-4">
                            <InputTextField
                                formControl={form.control}
                                name="className"
                                label="ClassName"
                                placeholder="Python 08:00-10:00"
                            />
                        </div>

                        {/* Date */}
                        <div className="col-span-4">
                            <DateField
                                formControl={form.control}
                                label="Date"
                            />
                        </div>

                        {/* username */}
                        <div className="col-span-4">
                            <InputTextField
                                formControl={form.control}
                                name="username"
                                label="Username"
                                placeholder="Ning"
                            />
                        </div>

                    </div>

                    {/* topic */}
                    <InputTextField
                        formControl={form.control}
                        name="topic"
                        label="Topic"
                        placeholder="Discord Bot ..."
                        isTextArea={true}
                        className="resize-none h-40"
                    />

                    {/* reviewNong */}
                    <InputTextField
                        formControl={form.control}
                        name="reviewNong"
                        label="ReviewNong"
                        placeholder="ReviewNong"
                        isTextArea={true}
                        className="resize-none h-60"
                    />

                    <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-4">
                        <Button type="submit" className="col-span-4">Submit</Button>
                        <Button type="button" onClick={clearForm} className="col-span-4">Clear Form</Button>
                        {/* Dialog */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="col-span-4" variant="outline">Reviewed<User />{formDataList?.length}</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader className="overflow-auto">
                                    <DialogTitle>ReviewNong</DialogTitle>
                                    {/* Table of data */}
                                    <div className="max-h-[500px] max-w-full overflow-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>ClassName</TableHead>
                                                    <TableHead>Date</TableHead>
                                                    <TableHead>UserName</TableHead>
                                                    <TableHead>Copy</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {/* <TableRow>
                                                    <TableCell colSpan={4} className="font-semibold bg-gray-50 text-center">
                                                        {getDateFormat(formDataList[0].date)}
                                                    </TableCell>
                                                </TableRow> */}
                                                {formDataList.map((formData: z.infer<typeof formSchema>, index: number) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{formData.className}</TableCell>
                                                        <TableCell>{getDateFormat(formData.date)}</TableCell>
                                                        <TableCell>{formData.username}</TableCell>
                                                        <TableCell>
                                                            <Button variant="outline" onClick={() => handleClipboard(formData, index)}>
                                                                <pre>{copiedList[index] ? "Copied" : "Copy"}</pre>
                                                                <Copy />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                        {/* <pre>{compileAllReviewText()}</pre> */}
                                    </div>

                                    <AlertDialogButton
                                        buttonLabel="Clear local storage"
                                        title="Do you want to delete?"
                                        description="It will delete all reviewed"
                                        variant="destructive"
                                        handelContinue={resetFormDataList}
                                    />
                                    <DialogDescription>
                                        {/* <pre>{compileAllReviewText()}</pre> */}
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    </div>
                </form>
            </Form>
        </div>
    )
}