"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {

  const pathname = usePathname();
  return (
    <nav className="flex justify-between border-b border-solid px-8 py-4">
      {/* Conteúdo do navbar logo */}
      <div className="flex items-center gap-10">
        <a href="/">
          <Image src="/logo.svg" alt="Finance AI" width={173} height={39} />
        </a>
        <Link href="/" className={
          pathname === "/" ? "text-primary font-bold" : "text-muted-foreground"
        }>Dashboard</Link>
        <Link href="/transactions" className={
          pathname === "/transactions" ? "text-primary font-bold" : "text-muted-foreground"
        }>Transações</Link>
        <Link href="/subscription" className={
          pathname === "/subscription" ? "text-primary font-bold" : "text-muted-foreground"
        }>Assinaturas</Link>
      </div>
      {/* Direita */}
      <UserButton showName />
    </nav>
  );
}

export default Navbar;