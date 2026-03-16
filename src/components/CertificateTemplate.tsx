import React, { forwardRef } from 'react';
// CORREÇÃO 1: Adicionado o "type" antes da importação
import type { Aluno } from '../utils/constants';

interface TemplateProps {
  aluno: Aluno;
  tema: string;
  dataReal: string;
  horas: string;
  local: string;
  page1Ref: React.RefObject<HTMLDivElement | null>;
  page2Ref: React.RefObject<HTMLDivElement | null>;
}

export const CertificateTemplate = forwardRef<HTMLDivElement, TemplateProps>(({ 
  aluno, tema, dataReal, horas, local, page1Ref, page2Ref 
}, ref) => (
  <div id="pdf-content" className="bg-white w-[1123px]" ref={ref}>
    {/* PÁGINA 1 - FRENTE */}
    <div ref={page1Ref} className="relative w-[1123px] h-[794px] overflow-hidden bg-white">
      <img src="/img/fundo_certificado.jpg" className="absolute inset-0 w-full h-full object-fill z-0" crossOrigin="anonymous" alt="Fundo" />
      <div className="absolute inset-0 z-10 font-serif text-black">
        <div className="absolute top-[42%] left-[50%] -translate-x-1/2 w-[82%] text-[20px] leading-[1.8] text-justify">
          <span className="block text-[32px] font-bold uppercase text-center mb-[25px] leading-tight font-sans tracking-wide">
            {aluno.nome}
          </span>
          natural do estado <span className="font-bold">{aluno.naturalidade}</span>, portador(a) do CPF <span className="font-bold">{aluno.cpf}</span> participou da aula sobre o tema "<span className="font-bold">{tema || "TEMA DO CURSO"}</span>", realizado no dia <span className="font-bold">{dataReal}</span>, com carga horária total de <span className="font-bold">{horas}</span>.
        </div>
        <div className="absolute top-[70%] right-[13%] w-[40%] text-[18px] text-center">{local}</div>
        <div className="absolute top-[80%] left-[13%] w-[25%] text-[18px] font-bold uppercase text-center font-sans leading-tight">
          {aluno.nome}
        </div>
      </div>
    </div>
    {/* PÁGINA 2 - VERSO */}
    <div ref={page2Ref} className="relative w-[1123px] h-[794px] overflow-hidden bg-white mt-4">
      <img src="/img/verso_certificado.jpg" className="absolute inset-0 w-full h-full object-fill z-0" crossOrigin="anonymous" alt="Verso" />
    </div>
  </div>
));