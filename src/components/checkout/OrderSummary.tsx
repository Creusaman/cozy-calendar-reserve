
import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryProps {
  subtotal: number;
  taxes: number;
  discount: number;
  total: number;
  discountApplied: boolean;
  showDetails?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  taxes,
  discount,
  total,
  discountApplied,
  showDetails = false
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>R$ {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Impostos</span>
          <span>R$ {taxes.toFixed(2)}</span>
        </div>
        {discountApplied && (
          <div className="flex justify-between text-green-600">
            <span>Desconto</span>
            <span>-R$ {discount.toFixed(2)}</span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>
        
        {showDetails && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="payment-details">
              <AccordionTrigger className="text-sm">
                Ver detalhes da reserva
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Suíte Premium</span> - 5 noites
                  </div>
                  <div>
                    <span className="font-medium">Chalé Familiar</span> - 2 noites
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
