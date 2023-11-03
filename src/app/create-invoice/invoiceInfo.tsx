import InputPullback from "@/components/inputPullback";
import { SelectMenu } from "@/components/selectMenu";
import { useState } from "react";

const InvoiceInfo = () => {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDateIssue, setInvoiceDateIssue] = useState("");
  const [invoiceDueDate, setInvoiceDueDate] = useState("");
  const [sendingMethod, setSendingMethod] = useState("");
  const sendingInvoiceOptions = [
    { value: "mail", label: "Mail" },
    { value: "whatsapp", label: "Whatsapp" },
    { value: "inhand", label: "In-hand" },
  ];

  const onChangeInvoiceNumber = (e: any) => {
    setInvoiceNumber(e.target.value);
  };

  const onChangeInvoiceDueDate = (e: any) => {
    setInvoiceDueDate(e.target.value);
  };

  const onChangeInvoiceDateIssue = (e: any) => {
    setInvoiceDateIssue(e.target.value);
  };
  return (
    <>
      <h3 className="text-lg">Invoice info</h3>
      <div className="flex justify-between mt-2 items-center">
        <div className="w-[calc(60%-8rem)]">
          <InputPullback
            value={invoiceNumber}
            type="number"
            onChange={onChangeInvoiceNumber}
            placeholder="Invoice Number #"
          />
        </div>
        <div className="w-32">
          <SelectMenu
            value={sendingMethod}
            setValue={setSendingMethod}
            options={sendingInvoiceOptions}
            label="Send via"
          />
        </div>
        <div className="w-1/6">
          <InputPullback
            value={invoiceDateIssue}
            type="number"
            onChange={onChangeInvoiceDateIssue}
            placeholder="Date Issue"
          />
        </div>
        <div className="w-1/6">
          <InputPullback
            value={invoiceDueDate}
            type="number"
            onChange={onChangeInvoiceDueDate}
            placeholder="Due Date"
          />
        </div>
      </div>
    </>
  );
};

export default InvoiceInfo;
