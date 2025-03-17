
import React from "react";
import { CheckCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessStepProps {
  total: number;
  onGoHome: () => void;
}

const SuccessStep: React.FC<SuccessStepProps> = ({ total, onGoHome }) => {
  return (
    <div className="text-center py-12">
      <div className="inline-block mb-6 p-4 rounded-full bg-green-100">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Reserva confirmada!</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-4">
        Sua reserva foi confirmada com sucesso. Enviamos um e-mail com todos os detalhes da sua estadia.
      </p>
      <div className="max-w-lg mx-auto p-4 border rounded-lg bg-muted/30 text-left mb-8">
        <h3 className="font-medium mb-2">Detalhes da reserva</h3>
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span>Número da reserva:</span>
            <span className="font-mono">EH{Math.floor(100000 + Math.random() * 900000)}</span>
          </div>
          <div className="flex justify-between">
            <span>Data da reserva:</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Valor total:</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <Button onClick={onGoHome}>
        <Home className="mr-2 h-4 w-4" />
        Voltar para Início
      </Button>
    </div>
  );
};

export default SuccessStep;
