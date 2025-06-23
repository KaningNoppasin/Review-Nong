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
import { User, Copy, Trash, Pencil } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
import { AlertDialogButton } from './components/dialog/alert-dialog-button';
import { ReviewFormField } from "./components/form/review-form-field"

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
        toast("Delete All Success")
        setFormDataList([])

        setIsOpenDeleteAll(false)
        setIsOpenReviewed(true);
    }

    const deleteFormData = (indexToRemove: number) => {
        const formDataListRemoved = [...formDataList.slice(0, indexToRemove), ...formDataList.slice(indexToRemove + 1)];
        toast("Delete !")
        setFormDataList(formDataListRemoved)

        setIsOpenDelete(false)
        setIsOpenReviewed(true);
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

    const handleEdit = async (formData: z.infer<typeof formSchema>, index: number) => {
        formEdit.reset(formData);
        setIsOpenEdited(true);
        setIsOpenReviewed(false);
        setIndexEdited(index)
    };

    const handleDelete = (index: number) => {
        setIndexDeleted(index)

        setIsOpenDelete(true)
        setIsOpenReviewed(false);
    };

    const handleDeleteAll = () => {
        setIsOpenDeleteAll(true)
        setIsOpenReviewed(false);
    };


    const [classNameData, setClassNameData] = useState<string>("");
    const [topicData, setTopicData] = useState<string>("");
    const [formDataList, setFormDataList] = useState<z.infer<typeof formSchema>[]>(getFormDataList());
    const [copiedList, setCopiedList] = useState<boolean[]>([false]);

    const [isOpenReviewed, setIsOpenReviewed] = useState<boolean>(false);
    const [isOpenEdited, setIsOpenEdited] = useState<boolean>(false);
    const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
    const [isOpenDeleteAll, setIsOpenDeleteAll] = useState<boolean>(false);
    const [indexEdited, setIndexEdited] = useState<number | null>(null);
    const [indexDeleted, setIndexDeleted] = useState<number | null>(null);

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

    const formEdit = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    })

    function onEditSubmit(formData: z.infer<typeof formSchema>, indexToEdit: number) {
        const formDataListEdited = [...formDataList];
        formDataListEdited[indexToEdit] = formData
        setFormDataList(formDataListEdited)
        toast(`Nong ${formData.username} Edited!`)

        setIsOpenEdited(false);
        setIsOpenReviewed(true);
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log(values);
            sessionStorage.setItem("className", values.className);
            sessionStorage.setItem("topic", values.topic);
            addFormDataList(values)
            clearFormWithOutClassNameAndTopic()
            toast("Success")
        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
        }
    }

    return (
        <div className="pl-5 pr-5">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">

                    <ReviewFormField formControl={form.control} />

                    <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-4">
                        <Button type="submit" className="col-span-4">Submit</Button>
                        <Button type="button" onClick={clearForm} className="col-span-4">Clear Form</Button>
                        <Button type="button" className="col-span-4" variant="outline" onClick={() => setIsOpenReviewed(true)}>Reviewed<User />{formDataList?.length}</Button>
                    </div>
                    {/* footer for safari ui */}
                    <div className="mb-10"></div>
                </form>
            </Form>

            {/* Dialog Reviewed*/}
            <Dialog open={isOpenReviewed} onOpenChange={setIsOpenReviewed}>
                <DialogContent>
                    <DialogHeader className="overflow-auto">
                        <DialogTitle>ReviewNong</DialogTitle>
                        {/* Table of data */}
                        <div className="max-h-[500px] max-w-full overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Class</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Nong</TableHead>
                                        <TableHead>Copy</TableHead>
                                        <TableHead>Edit</TableHead>
                                        <TableHead>Delete</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {/* <TableRow>
                                        <TableCell colSpan={4} className="font-semibold bg-gray-50 text-center">
                                            {getDateFormat(formDataList[0].date)}
                                        </TableCell>
                                    </TableRow> */}
                                    {formDataList.map((formData: z.infer<typeof formSchema>, index: number) => (
                                        <TableRow key={index} className={copiedList[index] ? "bg-gray-100" : ""}>
                                            <TableCell>{formData.className}</TableCell>
                                            <TableCell>{getDateFormat(formData.date)}</TableCell>
                                            <TableCell>{formData.username}</TableCell>
                                            <TableCell>
                                                {/* Copy Button */}
                                                <Button variant="outline" onClick={() => handleClipboard(formData, index)}><Copy /></Button>
                                            </TableCell>
                                            <TableCell>
                                                {/* Edit Button */}
                                                <Button variant="outline" onClick={() => handleEdit(formData, index)}><Pencil /></Button>
                                            </TableCell>
                                            <TableCell>
                                                {/* Delete Button */}
                                                <Button variant="outline" onClick={() => handleDelete(index)}><Trash /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <Button onClick={handleDeleteAll}><>Delete All<Trash /></></Button>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            {/* Dialog Edited*/}
            <Dialog open={isOpenEdited} onOpenChange={setIsOpenEdited}>
                <DialogContent>
                    <DialogHeader className="overflow-auto">
                        {indexEdited !== null && indexEdited !== undefined && formDataList[indexEdited] &&
                            <>
                                <DialogTitle>Edit {formDataList[indexEdited].username}</DialogTitle>
                                <Form {...formEdit}>
                                    <form onSubmit={(e) =>
                                        formEdit.handleSubmit((values) => onEditSubmit(values, indexEdited))(e)
                                    }>
                                        <div className="max-h-[500px] max-w-full overflow-auto">
                                            <ReviewFormField formControl={formEdit.control} />
                                        </div>
                                        <Button type="submit" className="w-full mt-3">Submit</Button>
                                    </form>
                                </Form>
                            </>
                        }
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            {/* Dialog DeleteAll*/}
            <AlertDialogButton
                open={isOpenDeleteAll}
                onOpenChange={setIsOpenDeleteAll}
                title="Do you want to delete?"
                description="It will delete all reviewed"
                handelContinue={resetFormDataList}
            />

            {/* Dialog Delete*/}
            {indexDeleted !== null && indexDeleted !== undefined && formDataList[indexDeleted] &&
                <AlertDialogButton
                    open={isOpenDelete}
                    onOpenChange={setIsOpenDelete}
                    title={`Do you want to delete?`}
                    description={`It will delete ${formDataList[indexDeleted].username} reviewed`}
                    handelContinue={() => deleteFormData(indexDeleted)}
                />
            }
        </div>
    )
}