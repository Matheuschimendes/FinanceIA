"use client";

import { ArrowDownUpIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import UpsertTransactionDialog from "./upsert-transaction-dialog";


const UpsertTransactionButton = () => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setDialogIsOpen(true)}
        className="text-cyan-50 rounded-full font-bold">
        Adicionar transação
        <ArrowDownUpIcon className="ml-2" />
      </Button>
      <UpsertTransactionDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
      />
    </>
  );
};

export default UpsertTransactionButton;
