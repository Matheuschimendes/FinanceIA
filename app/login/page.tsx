import Image from "next/image";
import { Button } from "../_components/ui/button";
import { LogInIcon } from "lucide-react";

const LoginPage = () => {
  return (
    <div className="grid h-full grid-cols-2">
      {/* ESQUERDO */}
      <div className="flex h-full flex-col justify-center max-w-[550px] p-8 mx-auto">
        <Image src="/logo.svg" alt="Finance AI " width={173} height={39} className="mb-8" />
        <h1 className="text-4xl font-bold mb-3">Bem-vindo</h1>
        <p className="text-muted-foreground mb-8">
          A Finance AI é uma plataforma de gestão financeira que utiliza IA para monitorar suas movimentações, e oferecer insights personalizados, facilitando o controle do seu orçamento.
        </p>
        <Button variant="outline">
          <LogInIcon className=" mr-2" />
          Fazer login</Button>
      </div>
      {/* DIRETIRO */}
      <div className="relative h-full w-full">
        <Image src="/login.png" alt="Faça login" fill className="object-cover" />
      </div>
    </div>
  );
}

export default LoginPage;