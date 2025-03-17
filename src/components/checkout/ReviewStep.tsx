
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RefreshCw, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import OrderSummary from "./OrderSummary";

interface ReviewStepProps {
  onContinue: () => void;
  subtotal: number;
  taxes: number;
  discount: number;
  total: number;
  discountApplied: boolean;
  setDiscountApplied: (applied: boolean) => void;
  isApplyingDiscount: boolean;
  setIsApplyingDiscount: (applying: boolean) => void;
}

const discountCodeSchema = z.object({
  code: z.string().min(3, "Código inválido")
});

const ReviewStep: React.FC<ReviewStepProps> = ({
  onContinue,
  subtotal,
  taxes,
  discount,
  total,
  discountApplied,
  setDiscountApplied,
  isApplyingDiscount,
  setIsApplyingDiscount
}) => {
  const discountForm = useForm<z.infer<typeof discountCodeSchema>>({
    resolver: zodResolver(discountCodeSchema),
    defaultValues: {
      code: ""
    }
  });

  const applyDiscount = (data: z.infer<typeof discountCodeSchema>) => {
    setIsApplyingDiscount(true);
    
    // Simulate API call to validate discount code
    setTimeout(() => {
      // Always succeed for this demo
      setDiscountApplied(true);
      setIsApplyingDiscount(false);
    }, 1500);
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Suas reservas</CardTitle>
            <CardDescription>Verifique os detalhes das suas reservas</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src="https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                        alt="Room" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Suíte Premium com Vista para o Mar</h3>
                      <p className="text-sm text-muted-foreground">2 adultos, 1 criança</p>
                      <div className="text-sm mt-1">
                        <span className="font-medium">Período: </span>
                        15/06 a 20/06 (5 noites)
                      </div>
                      <div className="text-sm font-medium mt-2">
                        R$ 850,00 × 5 noites = R$ 4.250,00
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                        alt="Room" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Chalé Familiar na Montanha</h3>
                      <p className="text-sm text-muted-foreground">2 adultos, 2 crianças</p>
                      <div className="text-sm mt-1">
                        <span className="font-medium">Período: </span>
                        15/06 a 17/06 (2 noites)
                      </div>
                      <div className="text-sm font-medium mt-2">
                        R$ 620,00 × 2 noites = R$ 1.240,00
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              onClick={onContinue}
            >
              Continuar para Pagamento
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Cupom de desconto</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...discountForm}>
              <form onSubmit={discountForm.handleSubmit(applyDiscount)} className="flex items-center gap-2">
                <FormField
                  control={discountForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Código do cupom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  disabled={isApplyingDiscount || discountApplied}
                >
                  {isApplyingDiscount ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Aplicando...
                    </>
                  ) : discountApplied ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Aplicado
                    </>
                  ) : (
                    "Aplicar"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <OrderSummary 
          subtotal={subtotal}
          taxes={taxes}
          discount={discount}
          total={total}
          discountApplied={discountApplied}
        />
      </div>
    </div>
  );
};

export default ReviewStep;
