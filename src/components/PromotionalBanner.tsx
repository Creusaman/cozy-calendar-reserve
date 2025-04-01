
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface CountdownProps {
  targetDate: Date;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-3 justify-center">
      <div className="bg-primary/10 rounded-md py-2 px-3 text-center min-w-[4rem]">
        <div className="text-2xl font-bold">{timeLeft.days}</div>
        <div className="text-xs text-muted-foreground">Dias</div>
      </div>
      <div className="bg-primary/10 rounded-md py-2 px-3 text-center min-w-[4rem]">
        <div className="text-2xl font-bold">{timeLeft.hours}</div>
        <div className="text-xs text-muted-foreground">Horas</div>
      </div>
      <div className="bg-primary/10 rounded-md py-2 px-3 text-center min-w-[4rem]">
        <div className="text-2xl font-bold">{timeLeft.minutes}</div>
        <div className="text-xs text-muted-foreground">Min</div>
      </div>
      <div className="bg-primary/10 rounded-md py-2 px-3 text-center min-w-[4rem]">
        <div className="text-2xl font-bold">{timeLeft.seconds}</div>
        <div className="text-xs text-muted-foreground">Seg</div>
      </div>
    </div>
  );
};

const PromotionalBanner: React.FC = () => {
  // Data do Réveillon (31 de dezembro)
  const reveillonDate = new Date(new Date().getFullYear(), 11, 31);
  
  return (
    <div className="bg-gradient-to-r from-primary/5 to-primary/20 py-8 px-4 rounded-xl mb-10">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium mb-2">
          <Sparkles className="h-4 w-4 mr-2" />
          Oferta Especial
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">Réveillon 2023: Uma Celebração Inesquecível</h2>
        <p className="text-lg text-muted-foreground">
          Pacotes especiais com até 20% de desconto para celebrar a virada do ano em grande estilo
        </p>
        
        <div className="py-4">
          <Countdown targetDate={reveillonDate} />
        </div>
        
        <Button size="lg" className="mt-2">
          Reservar Agora!
        </Button>
      </div>
    </div>
  );
};

export default PromotionalBanner;
