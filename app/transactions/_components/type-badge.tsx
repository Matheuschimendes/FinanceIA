import { Transaction, TransactionType } from "@prisma/client"
import { CircleIcon } from "lucide-react"
import { Badge } from "@/app/_components/ui/badge"

interface TransactionTypeBadgeProps {
  transaction: Transaction,
}

const TransactionTypeBadge = ({ transaction }: TransactionTypeBadgeProps) => {
  if (transaction.type === TransactionType.DEPOSIT) {
    return (
      <Badge className="bg-muted text-primary hover:bg-muted font-bold">
        <CircleIcon className="mr-2 fill-primary" size={10} />
        Deposito
      </Badge>
    )

  }
  if (transaction.type === TransactionType.EXPENSE) {
    return (
      <Badge className="font bold text-danger bg-danger bg-opacity-10">
        <CircleIcon className="mr-2 fill-danger" size={10} />
        Despesas
      </Badge>
    )
  }
  if (transaction.type === TransactionType.INVESTMENT) {
    return (
      <Badge className="font bold text-white bg-white bg-opacity-10">
        <CircleIcon className="mr-2 fill-white" size={10} />
        Investimento
      </Badge>
    )
  }
}

export default TransactionTypeBadge;