
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  ArrowLeft, CreditCard, Qrcode, CheckCircle, AlertCircle, 
  Info, Copy, RefreshCw, Home, ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

enum CheckoutStep {
  REVIEW = "review",
  PAYMENT = "payment",
  PROCESSING = "processing",
  FAILED = "failed",
  SUCCESS = "success"
}

const cardFormSchema = z.object({
  cardNumber: z.string().min(16, "Número do cartão inválido").max(19),
  cardName: z.string().min(3, "Nome inválido"),
  expiry: z.string().min(5, "Data inválida"),
  cvc: z.string().min(3, "CVC inválido").max(4),
  installments: z.string()
});

const discountCodeSchema = z.object({
  code: z.string().min(3, "Código inválido")
});

const Checkout = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = React.useState<CheckoutStep>(CheckoutStep.REVIEW);
  const [paymentMethod, setPaymentMethod] = React.useState<"card" | "pix">("card");
  const [isApplyingDiscount, setIsApplyingDiscount] = React.useState(false);
  const [discountApplied, setDiscountApplied] = React.useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = React.useState(false);
  
  // Mock data that would normally come from a cart context or state
  const subtotal = 1470;
  const discount = discountApplied ? 150 : 0;
  const taxes = 120;
  const total = subtotal - discount + taxes;
  
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

  const discountForm = useForm<z.infer<typeof discountCodeSchema>>({
    resolver: zodResolver(discountCodeSchema),
    defaultValues: {
      code: ""
    }
  });

  const onCardSubmit = (data: z.infer<typeof cardFormSchema>) => {
    setIsProcessingPayment(true);
    setCurrentStep(CheckoutStep.PROCESSING);
    
    // Simulate payment processing
    setTimeout(() => {
      // 80% chance of success
      const isSuccess = Math.random() > 0.2;
      
      if (isSuccess) {
        setCurrentStep(CheckoutStep.SUCCESS);
      } else {
        setCurrentStep(CheckoutStep.FAILED);
      }
      
      setIsProcessingPayment(false);
    }, 3000);
  };

  const onPixSubmit = () => {
    setIsProcessingPayment(true);
    setCurrentStep(CheckoutStep.PROCESSING);
    
    // Simulate payment processing (PIX is almost always successful in this demo)
    setTimeout(() => {
      setCurrentStep(CheckoutStep.SUCCESS);
      setIsProcessingPayment(false);
    }, 3000);
  };

  const applyDiscount = (data: z.infer<typeof discountCodeSchema>) => {
    setIsApplyingDiscount(true);
    
    // Simulate API call to validate discount code
    setTimeout(() => {
      // Always succeed for this demo
      setDiscountApplied(true);
      toast.success("Cupom aplicado com sucesso!");
      setIsApplyingDiscount(false);
    }, 1500);
  };

  const resetPaymentAttempt = () => {
    setCurrentStep(CheckoutStep.PAYMENT);
    cardForm.reset();
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <header className="sticky top-0 z-10 backdrop-blur-sm bg-background/80 border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate("/")} className="text-lg font-bold flex items-center">
            <Home className="mr-2 h-5 w-5" />
            Elegante Hospedagem
          </Button>
          
          <div className="flex items-center">
            {currentStep === CheckoutStep.REVIEW && (
              <Button variant="outline" size="sm" onClick={() => navigate("/")}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Voltar ao Carrinho
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb and heading */}
          <div className="mb-8">
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <button onClick={() => navigate("/")} className="hover:underline">Início</button>
              <span className="mx-2">/</span>
              <button onClick={() => navigate("/")} className="hover:underline">Carrinho</button>
              <span className="mx-2">/</span>
              <span className="text-foreground">Checkout</span>
            </div>
            <h1 className="text-3xl font-bold">Finalizar Reserva</h1>
          </div>
          
          {/* Progress steps */}
          {currentStep !== CheckoutStep.SUCCESS && (
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
          )}
          
          {/* Main content */}
          {currentStep === CheckoutStep.REVIEW && (
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
                      onClick={() => setCurrentStep(CheckoutStep.PAYMENT)}
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
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          {currentStep === CheckoutStep.PAYMENT && (
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
                          <Qrcode className="mr-2 h-4 w-4" />
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
                            <Qrcode className="h-32 w-32 text-primary" />
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
                    onClick={() => setCurrentStep(CheckoutStep.REVIEW)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                </div>
              </div>
              
              <div>
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
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          {currentStep === CheckoutStep.PROCESSING && (
            <div className="text-center py-12">
              <div className="inline-block mb-6">
                <RefreshCw className="h-12 w-12 text-primary animate-spin" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Processando seu pagamento</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Por favor, aguarde enquanto processamos sua transação. Isso pode levar alguns instantes.
              </p>
            </div>
          )}
          
          {currentStep === CheckoutStep.FAILED && (
            <div className="text-center py-12">
              <div className="inline-block mb-6 p-4 rounded-full bg-destructive/10">
                <AlertCircle className="h-12 w-12 text-destructive" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Pagamento não autorizado</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Infelizmente, seu pagamento não foi autorizado. Por favor, verifique os dados do cartão ou tente outro método de pagamento.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={resetPaymentAttempt}>
                  Tentar novamente
                </Button>
                <Button variant="outline" onClick={() => setCurrentStep(CheckoutStep.REVIEW)}>
                  Escolher outro método
                </Button>
              </div>
            </div>
          )}
          
          {currentStep === CheckoutStep.SUCCESS && (
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
              <Button onClick={handleGoHome}>
                <Home className="mr-2 h-4 w-4" />
                Voltar para Início
              </Button>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }
        
        .step-number {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: var(--muted);
          color: var(--muted-foreground);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-bottom: 8px;
        }
        
        .step-item.active .step-number {
          background-color: var(--primary);
          color: white;
        }
        
        .step-label {
          font-size: 14px;
          color: var(--muted-foreground);
        }
        
        .step-item.active .step-label {
          color: var(--foreground);
          font-weight: 500;
        }
        
        .step-divider {
          flex: 1;
          height: 2px;
          background-color: var(--border);
          margin: 0 16px;
          margin-bottom: 32px;
        }
      `}</style>
    </div>
  );
};

export default Checkout;
