import type { ReactNode } from "react";

interface ParcentageItemProps {
  icon: ReactNode;
  title: string;
  value: number;
}

const ParcentageItem = ({ icon, title, value }: ParcentageItemProps) => {
  return (
    <div className="flex justify-between items-center">
      {/* Icone */}
      <div className="flex items-center gap-2">
        {icon}
        <p className="">{title}</p>
      </div>
      {/* Valor */}
      <p className="font-bold text-sm">
        {value}%
      </p>
    </div>
  );
}

export default ParcentageItem;