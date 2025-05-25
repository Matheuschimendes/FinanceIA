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
        <div className="bg-white bg-opacity-[3%] rounded-lg p-2">
          {icon}
        </div>
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