"use client";
import { useEffect, useState } from "react";
import { DataTable } from "./DataTable";
import { columns } from "./columns";
import { axiosProtected } from "@/services/axiosService";
import { EsimBookHistory } from "@/types/e-sim";
import { toast } from "sonner";

const BookingTable = () => {
  const [formattedData, setFormattedData] = useState<EsimBookHistory[]>([]);

  useEffect(() => {
    axiosProtected
      .get(`/e-sim/order-list/`)
      .then((response: any) => {
        const rawData = response.data.data;
        console.log("rawData", rawData)
        const formatted = rawData.map((order: any) =>
          order.order_details.map((detail: EsimBookHistory) => ({
            order_id: order.order_id,
            order_cost: order.order_cost,
            plan_name: detail.plan_name,
            mobile_number: detail.mobile_number,
            sim_number: detail.sim_number,
            activation_code: detail.activation_code,
          }))
        ).flat();
        setFormattedData(formatted);
        console.log("Formatted Data", formatted);
      })
      .catch((error: any) => {
        const errorMessage =
          (typeof error === "object" &&
            error !== null &&
            "message" in error &&
            typeof (error as { message: string }).message === "string" &&
            (error as { message: string }).message) ||
          "An unexpected error occurred!";

        toast.error(errorMessage);
        console.error("Error:", error);
      });
  }, []);

  return (
    <div className="rounded-md shadow-md border border-slate-400">
      <DataTable columns={columns} data={formattedData} />
    </div>
  );
};

export default BookingTable;
