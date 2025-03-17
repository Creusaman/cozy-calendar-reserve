
import React from "react";
import { ArrowLeft, CreditCard, QrCode, Copy, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import OrderSummary from "./OrderSummary";

interface PaymentStepProps {
  onBack: () => void;
  onCardSubmit: (data: any) => void;
  onPixSubmit: () => void;
  subtotal: number;
  taxes: number;
  discount: number;
  total: number;
  discountApplied: boolean;
}

const cardFormSchema = z.object({
  cardNumber: z.string().min(16, "Número do cartão inválido").max(19),
  cardName: z.string().min(3, "Nome inválido"),
  expiry: z.string().min(5, "Data inválida"),
  cvc: z.string().min(3, "CVC inválido").max(4),
  installments: z.string()
});

const PaymentStep: React.FC<PaymentStepProps> = ({
  onBack,
  onCardSubmit,
  onPixSubmit,
  subtotal,
  taxes,
  discount,
  total,
  discountApplied
}) => {
  const [paymentMethod, setPaymentMethod] = React.useState<"card" | "pix">("card");
  
  const cardForm = useForm<z.infer<typeof cardFormSchema>>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      cardNumber: "",
      cardName: "",
      expiry: "",
      cvc: "",
      installments: "1"
    }
  });

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Método de Pagamento</CardTitle>
            <CardDescription>Escolha como deseja pagar</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="card" onValueChange={(value) => setPaymentMethod(value as "card" | "pix")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="card">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Cartão de Crédito
                </TabsTrigger>
                <TabsTrigger value="pix">
                  <QrCode className="mr-2 h-4 w-4" />
                  PIX
                </TabsTrigger>
              </TabsList>
              <TabsContent value="card" className="pt-4">
                <Form {...cardForm}>
                  <form onSubmit={cardForm.handleSubmit(onCardSubmit)} className="space-y-4">
                    <FormField
                      control={cardForm.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número do Cartão</FormLabel>
                          <FormControl>
                            <Input placeholder="0000 0000 0000 0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={cardForm.control}
                      name="cardName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome no Cartão</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome como aparece no cartão" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={cardForm.control}
                        name="expiry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data de Expiração</FormLabel>
                            <FormControl>
                              <Input placeholder="MM/AA" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={cardForm.control}
                        name="cvc"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CVC</FormLabel>
                            <FormControl>
                              <Input placeholder="123" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={cardForm.control}
                      name="installments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parcelas</FormLabel>
                          <FormControl>
                            <select 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              <option value="1">1x de R$ {total.toFixed(2)}</option>
                              <option value="2">2x de R$ {(total / 2).toFixed(2)}</option>
                              <option value="3">3x de R$ {(total / 3).toFixed(2)}</option>
                              <option value="4">4x de R$ {(total / 4).toFixed(2)}</option>
                              <option value="5">5x de R$ {(total / 5).toFixed(2)}</option>
                              <option value="6">6x de R$ {(total / 6).toFixed(2)}</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">
                      Finalizar Pagamento
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="pix" className="pt-4 space-y-4">
                <div className="border rounded-lg p-6 bg-muted/20 text-center space-y-4">
                  <div className="mx-auto bg-white p-4 rounded-lg w-48 h-48 flex items-center justify-center">
                    {/* Placeholder for QR code */}
                    <QrCode className="h-32 w-32 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Valor: R$ {total.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground mt-1">Escaneie o QR code ou copie o código abaixo</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="bg-muted rounded-lg px-3 py-2 text-sm flex items-center gap-2 max-w-full">
                      <code className="text-xs truncate">pix.exemplo.com.br/pagamentos/2b4ac6d90fbe</code>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg border bg-amber-50 border-amber-200 text-amber-800 flex gap-2">
                  <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Após realizar o pagamento por PIX</p>
                    <p className="mt-0.5">Clique em "Confirmar Pagamento" abaixo para finalizar seu pedido. O pagamento será confirmado automaticamente.</p>
                  </div>
                </div>
                <Button className="w-full" onClick={onPixSubmit}>
                  Confirmar Pagamento
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="mt-4">
          <Button 
            variant="outline" 
            onClick={onBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </div>
      
      <div>
        <OrderSummary 
          subtotal={subtotal}
          taxes={taxes}
          discount={discount}
          total={total}
          discountApplied={discountApplied}
          showDetails={true}
        />
      </div>
    </div>
  );
};

export default PaymentStep;
