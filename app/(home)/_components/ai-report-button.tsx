"use client";

import { Button } from "@/app/_components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/app/_components/ui/dialog";
import { BotIcon } from "lucide-react";
import { genereteAiRepost } from "../_actions/generate-ai-report";
import { useState } from "react";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import Markdown from "react-markdown";

interface AiReportButtonProps {
  month: string;
}

const AiReportButton = ({ month }: AiReportButtonProps) => {
  const [report, setReport] = useState<string | null>();
  const [reportIsLoading, setReportIsLoading] = useState(false);
  const handleGenerateReportClick = async () => {
    try {
      setReportIsLoading(true);
      const aiReport = await genereteAiRepost({ month });
      setReport(aiReport);
    }
    catch (error) {
      console.error("Erro ao gerar relatorio:", error);
    } finally {
      setReportIsLoading(false);
    }

  }
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost">
            Relatorio IA
            <BotIcon />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Relatiorio IA</DialogTitle>
            <DialogDescription>
              Use interligencia artificial para gerar relatorios com intelegencia artificial.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="prose max-h-[450px] text-white prose-h3:text-white prose-h4:text-white prose-strong:text-white">
            <Markdown>{report}</Markdown>
          </ScrollArea>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleGenerateReportClick} disabled={reportIsLoading}>Gerar Relatorio
              {reportIsLoading && <span className="ml-2 animate-spin">...</span>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AiReportButton;