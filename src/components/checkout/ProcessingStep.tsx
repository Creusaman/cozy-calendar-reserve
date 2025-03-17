
import React from "react";
import { RefreshCw } from "lucide-react";

const ProcessingStep: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="inline-block mb-6">
        <RefreshCw className="h-12 w-12 text-primary animate-spin" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Processando seu pagamento</h2>
      <p className="text-muted-foreground max-w-md mx-auto">
        Por favor, aguarde enquanto processamos sua transação. Isso pode levar alguns instantes.
      </p>
    </div>
  );
};

export default ProcessingStep;
