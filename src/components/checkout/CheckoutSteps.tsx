
import React from "react";
import { CheckoutStep } from "@/types/checkout";

interface CheckoutStepsProps {
  currentStep: CheckoutStep;
}

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ currentStep }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center">
        <div className={`step-item ${currentStep === CheckoutStep.REVIEW || currentStep === CheckoutStep.PAYMENT || currentStep === CheckoutStep.PROCESSING || currentStep === CheckoutStep.FAILED || currentStep === CheckoutStep.SUCCESS ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Revisar</div>
        </div>
        <div className="step-divider"></div>
        <div className={`step-item ${currentStep === CheckoutStep.PAYMENT || currentStep === CheckoutStep.PROCESSING || currentStep === CheckoutStep.FAILED || currentStep === CheckoutStep.SUCCESS ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Pagamento</div>
        </div>
        <div className="step-divider"></div>
        <div className={`step-item ${currentStep === CheckoutStep.SUCCESS ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Confirmação</div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSteps;
