import React from 'react';
import { Icon } from './Icon';

interface PersonalTrainerProps {
  onBack: () => void;
}

export const PersonalTrainer: React.FC<PersonalTrainerProps> = ({ onBack }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-[#f0f0f0] min-h-screen flex justify-center font-display">
      <div className="relative flex min-h-screen w-full max-w-[430px] flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
        <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-50">
          <div
            onClick={onBack}
            className="text-primary flex size-12 shrink-0 items-center justify-start cursor-pointer"
          >
            <Icon name="arrow_back_ios" className="text-[24px]" />
          </div>
          <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Personal Trainer</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="@container">
            <div className="@[480px]:px-4 @[480px]:py-3">
              <div
                className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-background-dark @[480px]:rounded-xl min-h-[400px] relative"
                style={{ backgroundImage: 'linear-gradient(0deg, rgba(20,20,20,1) 0%, rgba(20,20,20,0.4) 50%, rgba(20,20,20,0) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDv81XkOq-IweuQzB6edwV45uhlEC8eCyBaa7gheuqIgWPt8CJA2_X_kptJyTtr7hs7om-z9eC34hTqpw-XP899F4DxRPwunhmXXNe3M69m8EO_65KQNGpcSIZf7GJH0xv6kb9T1matLP--9iMlbtBM8nOmdYcRKCUGrowal9TOim-wpMC3P4n8Jq8un_MZKYG7MPZbS3oR75H1MdEbNefRx8h6FWhBO1Pt4GQYWaYFE-nsV0M-Ylc36FcViscvAK8CMM_skJpFcdfH")' }}
              >
              </div>
            </div>
          </div>
          <h1 className="text-gray-900 dark:text-white tracking-light text-[32px] font-extrabold leading-tight px-4 text-left pb-3 pt-6">
            Transforme seu corpo com consultoria especializada
          </h1>
          <div className="px-4 space-y-1">
            <div className="flex gap-x-3 py-3 flex-row items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon name="fitness_center" />
              </div>
              <div className="flex flex-col">
                <p className="text-gray-900 dark:text-white text-base font-semibold leading-normal">Treinos personalizados</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Adaptados aos seus objetivos e limites.</p>
              </div>
            </div>
            <div className="flex gap-x-3 py-3 flex-row items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon name="chat" />
              </div>
              <div className="flex flex-col">
                <p className="text-gray-900 dark:text-white text-base font-semibold leading-normal">Suporte via WhatsApp</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Dúvidas respondidas em tempo real.</p>
              </div>
            </div>
            <div className="flex gap-x-3 py-3 flex-row items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon name="monitoring" />
              </div>
              <div className="flex flex-col">
                <p className="text-gray-900 dark:text-white text-base font-semibold leading-normal">Acompanhamento de resultados</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Gráficos e métricas de evolução mensal.</p>
              </div>
            </div>
          </div>
          <div className="px-4 pt-8 pb-12">
            <a
              href="https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre a consultoria de Personal Trainer."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-primary hover:bg-[#c00032] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-colors active:scale-[0.98] no-underline"
            >
              <Icon name="send" />
              QUERO COMEÇAR AGORA
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};