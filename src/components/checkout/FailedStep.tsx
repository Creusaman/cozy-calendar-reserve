
import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FailedStepProps {
  onRetry: () => void;
  onSelectAnotherMethod: () => void;
}

const FailedStep: React.FC<FailedStepProps> = ({ onRetry, onSelectAnotherMethod }) => {
  return (
    <div className="text-center py-12">
      <div className="inline-block mb-6 p-4 rounded-full bg-destructive/10">
        <AlertCircle className="h-12 w-12 text-destructive" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Pagamento não autorizado</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        Infelizmente, seu pagamento não foi autorizado. Por favor, verifique os dados do cartão ou tente outro método de pagamento.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={onRetry}>
          Tentar novamente
        </Button>
        <Button variant="outline" onClick={onSelectAnotherMethod}>
          Escolher outro método
        </Button>
      </div>
    </div>
  );
};

export default FailedStep;
