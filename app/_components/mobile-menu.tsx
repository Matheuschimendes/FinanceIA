"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  BadgeDollarSign,
  // Settings,
} from "lucide-react";

const items = [
  {
    href: "/",
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    href: "/transactions",
    label: "Transações",
    icon: <ArrowLeftRight size={20} />,
  },
  {
    href: "/subscription",
    label: "Assinatura",
    icon: <BadgeDollarSign size={20} />,
  },
  // {
  //   href: "/settings",
  //   label: "Setting",
  //   icon: <Settings size={20} />,
  // },
];

const MobileMenu = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t bg-background/95 backdrop-blur-md md:hidden">
      <ul className="flex justify-around items-center py-3">
        {/* Itens do menu */}
        {items.map(({ href, label, icon }) => {
          // Verifica se a rota atual corresponde ao href
          const isActive = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className="flex flex-col items-center text-xs"
              >
                <div
                  className={`mb-1 ${isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                >
                  {icon}
                </div>
                <span
                  className={`${isActive
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                    }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MobileMenu;
