"use client"

import useInvoker from "@/utils/useInvoker"
import { useEffect, useState } from "react"
import { CiSignpostR1 } from "react-icons/ci"
import { ReportsTable } from "./table"
import { Report } from "@/types/report"

function ReportsView() {
    const invoker = useInvoker({ baseUrl: "http://localhost:3542/api" })
    const [is_loading, set_is_loading] = useState<boolean>(true)
    const [reports, set_reports] = useState<Report[]>([])

    const loader = async () => {
        const { data } = await invoker.get("/report/paging")

        set_reports(data)
    }

    useEffect(() => {
        loader()
    }, [])

    const deleteMessage = async (reportId: string) => {
        const { data, status } = await invoker.remove(`/report/${reportId}/delete-message`)
        if (status === 200) {
            await loader()
        }
    }

    return <div className="min-h-screen">
        <div className="h-[6vh] border-b-2 flex items-center px-6">
            <h1 className="flex space-x-2 items-center font-semibold text-gray-500"><CiSignpostR1 className="text-xl" /> <span>Admin/Reports</span></h1>
        </div>
        <div className="h-[94vh] overflow-y-auto p-4">
            <ReportsTable reports={reports} deleteMessage={deleteMessage}/>
        </div>
    </div>
}; export default ReportsView