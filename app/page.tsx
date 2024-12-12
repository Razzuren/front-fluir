"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-8">
      <h1 className="text-4xl font-bold text-center">
        Bem-vindo ao 🩺Fluir
      </h1>
      <p className="text-lg text-center max-w-2xl">
        O Fluir é uma aplicação projetada para facilitar a vida dos médicos,
        reduzindo a burocracia em documentos médicos. Escreva histórias médicas 
        e gere encaminhamentos com a ajuda de inteligência artificial.
      </p>

      <div className="flex space-x-4">
        <Link href="/referral">
          <button className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Criar Documento Médico
          </button>
        </Link>
      </div>
    </div>
  );
}
