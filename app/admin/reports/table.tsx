"use client"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Report } from "@/types/report"
import { AiOutlineEye } from "react-icons/ai"
import Avatar from "@/components/useful/avatar"

const invoices = [
    {
        invoice: "INV001",
        paymentStatus: "Paid",
        totalAmount: "$250.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV002",
        paymentStatus: "Pending",
        totalAmount: "$150.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV003",
        paymentStatus: "Unpaid",
        totalAmount: "$350.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV004",
        paymentStatus: "Paid",
        totalAmount: "$450.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV005",
        paymentStatus: "Paid",
        totalAmount: "$550.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV006",
        paymentStatus: "Pending",
        totalAmount: "$200.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV007",
        paymentStatus: "Unpaid",
        totalAmount: "$300.00",
        paymentMethod: "Credit Card",
    },
]

type Props = {
    reports: Report[]
    deleteMessage: (reportId: string) => Promise<void>
}

export function ReportsTable({ reports, deleteMessage }: Props) {

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Target</TableHead>
                    <TableHead>CreatedBy</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {reports.map((report) => (
                    <TableRow key={report._id}>
                        <TableCell className="font-medium flex items-center space-x-2">
                            <span className="text-red-500">{report.target.username}</span>
                            <Dialog>
                                <DialogTrigger>
                                    <button className="cursor-pointer"><AiOutlineEye /></button>
                                </DialogTrigger>
                                <DialogContent>
                                    <div className="flex space-x-3 items-center">
                                        <Avatar name={report.target.fullName} src={report.target.avatar} className="w-10 h-10 rounded-full" />
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{report.target.fullName}</span>
                                            <small>{report.target.username}</small>
                                        </div>
                                    </div>
                                    <p>Actions:</p>
                                    <div className="flex space-x-2 items-center">
                                        <button className="text-sm bg-red-500 text-white px-2">Delete user</button>
                                        <button className="text-sm bg-yellow-500 text-white px-2">Block user</button>
                                    </div>
                                </DialogContent>
                            </Dialog>

                        </TableCell>
                        <TableCell>{report.createdBy.username}</TableCell>
                        <TableCell className="flex space-x-2 items-center">
                            <span>{report.message?.message ?? "--"}</span>
                            <Dialog>
                                <DialogTrigger>
                                    <button className="cursor-pointer"><AiOutlineEye /></button>
                                </DialogTrigger>
                                <DialogContent>
                                    <div className="flex space-x-3 items-center">
                                        <Avatar name={report.target.fullName} src={report.target.avatar} className="w-10 h-10 rounded-full" />
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{report.target.fullName}</span>
                                            <small>{report.target.username}</small>
                                        </div>
                                    </div>
                                    {report.message.isDeleted && <p className="px-2 bg-red-500 text-white text-sm font-semibold uppercase">Message has been deleted</p>}
                                    <div className="rounded-md px-3 py-1 border-2">
                                        <p className="text-sm text-gray-500">Content: {report.message.message}</p>
                                        {report.message.file && <div className="flex space-x-2">
                                            <span>Attachments:</span>
                                            <a href={report.message.file} target="_blank">Download</a>
                                        </div>}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </TableCell>
                        <TableCell>{report.reason}</TableCell>
                        <TableCell>
                            {
                                report.isResolved ? <span className="py-[2px] px-2 bg-green-500 font-semibold text-white">Resolved</span>
                                    : <span className="py-[2px] px-2 bg-yellow-500 font-semibold text-white">Pending</span>
                            }
                        </TableCell>
                        <TableCell className="flex items-center space-x-2">
                            <button onClick={() => deleteMessage(report._id)} className="px-2 py-[2px] font-semibold text-white bg-red-500">Delete Message</button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter className="w-full bg-red-500">

            </TableFooter>
        </Table>
    )
}