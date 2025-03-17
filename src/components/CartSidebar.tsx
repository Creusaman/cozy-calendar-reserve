
import * as React from "react";
import { ShoppingCart, X, AlertCircle, ArrowRight, Trash, Edit, RefreshCw, User, Baby } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Sheet, 
  SheetContent, 
  SheetFooter, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Room } from "@/components/RoomCard";
import { RoomDetailsData } from "@/components/RoomDetailsForm";
import { format } from "date-fns";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

export interface CartItem {
  room: Room;
  details: RoomDetailsData;
  id: string;
}

interface CartSidebarProps {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onCheckoutClick: () => void;
  checkAvailability: () => Promise<boolean>;
  onEditItem?: (id: string, details: RoomDetailsData) => void;
  className?: string;
}

export function CartSidebar({
  items,
  onRemoveItem,
  onClearCart,
  onCheckoutClick,
  checkAvailability,
  onEditItem,
  className,
}: CartSidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [allAvailable, setAllAvailable] = React.useState(true);

  const totalPrice = items.reduce((total, item) => {
    // Calculate total nights for all persons
    let totalNights = 0;
    item.details.persons.forEach(person => {
      if (person.dateRange.from && person.dateRange.to) {
        const nights = Math.ceil(
          (person.dateRange.to.getTime() - person.dateRange.from.getTime()) / (1000 * 60 * 60 * 24)
        );
        totalNights += nights;
      }
    });
    return total + (item.room.price * totalNights);
  }, 0);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && items.length > 0) {
      refreshAvailability();
    }
  };

  const refreshAvailability = async () => {
    if (items.length === 0) return;
    
    setIsLoading(true);
    try {
      const available = await checkAvailability();
      setAllAvailable(available);
      if (!available) {
        toast.error("Algumas acomodações não estão mais disponíveis.");
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      toast.error("Erro ao verificar disponibilidade.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = () => {
    if (!allAvailable) {
      toast.error("Remova os itens indisponíveis antes de finalizar.");
      return;
    }
    
    onCheckoutClick();
    setIsOpen(false);
  };

  const renderPersonIcons = (item: CartItem) => {
    const { adults, children } = item.details;
    const filledPersons = item.details.persons.filter(p => p.name).length;
    
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {Array.from({ length: adults }).map((_, i) => (
          <div 
            key={`adult-${i}`} 
            className={cn(
              "rounded-full p-1",
              i < filledPersons ? "text-primary" : "text-muted-foreground/40"
            )}
            title={i < filledPersons ? "Vaga ocupada" : "Vaga disponível"}
          >
            <User className="h-4 w-4" />
          </div>
        ))}
        {Array.from({ length: children }).map((_, i) => (
          <div 
            key={`child-${i}`} 
            className={cn(
              "rounded-full p-1",
              adults + i < filledPersons ? "text-primary" : "text-muted-foreground/40"
            )}
            title={adults + i < filledPersons ? "Vaga ocupada" : "Vaga disponível"}
          >
            <Baby className="h-4 w-4" />
          </div>
        ))}
      </div>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn("relative", className)}
        >
          <ShoppingCart className="h-5 w-5" />
          {items.length > 0 && (
            <Badge
              className="absolute -top-2 -right-2 px-1.5 py-0.5 min-w-[1.25rem] h-5"
              variant="destructive"
            >
              {items.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md w-full p-0 flex flex-col animate-slide-in-right">
        <SheetHeader className="p-6 pb-0">
          <SheetTitle className="flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Carrinho de Reservas
            {items.length > 0 && (
              <Badge className="ml-2">{items.length}</Badge>
            )}
          </SheetTitle>
        </SheetHeader>
        
        {items.length > 0 ? (
          <>
            <ScrollArea className="flex-1 px-6 py-4">
              <div className="space-y-4">
                {!allAvailable && (
                  <div className="bg-destructive/10 text-destructive rounded-md p-3 flex items-start mb-4">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Disponibilidade alterada</p>
                      <p className="text-xs">
                        Algumas acomodações não estão mais disponíveis. Remova-as antes de continuar.
                      </p>
                    </div>
                  </div>
                )}
                
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className={cn(
                      "border rounded-lg p-4 space-y-3 transition-all duration-300",
                      !item.room.available && "border-destructive/50 bg-destructive/5"
                    )}
                  >
                    <div className="flex gap-3">
                      {/* Room image */}
                      <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={item.room.media[0].src} 
                          alt={item.room.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{item.room.name}</h3>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {item.details.adults} adulto{item.details.adults !== 1 && 's'}
                              {item.details.children > 0 && `, ${item.details.children} criança${item.details.children !== 1 && 's'}`}
                              {item.details.pets > 0 && `, ${item.details.pets} animal${item.details.pets !== 1 && 'is'}`}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Editar Reserva</DialogTitle>
                                </DialogHeader>
                                {/* Placeholder for edit form */}
                                <div className="py-4">
                                  {/* This would be replaced with actual form */}
                                  <p className="text-sm text-muted-foreground mb-4">
                                    Edição de reserva não implementada nesta versão.
                                  </p>
                                  <Button className="w-full">Salvar Alterações</Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => onRemoveItem(item.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Person indicators */}
                        {renderPersonIcons(item)}
                      </div>
                    </div>
                    
                    {!item.room.available && (
                      <div className="bg-destructive/10 rounded p-2 text-xs text-destructive">
                        Indisponível no momento
                      </div>
                    )}
                    
                    <div className="space-y-1.5">
                      {item.details.useIndividualDates ? (
                        <div className="text-xs">
                          <span className="font-medium">Datas individualizadas</span>
                        </div>
                      ) : item.details.persons[0]?.dateRange.from && item.details.persons[0]?.dateRange.to ? (
                        <div className="text-xs">
                          <span className="font-medium">Período: </span>
                          {format(item.details.persons[0].dateRange.from, "dd/MM")} a {format(item.details.persons[0].dateRange.to, "dd/MM")}
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground">
                          Datas não definidas
                        </div>
                      )}
                    </div>
                    
                    <div className="text-sm font-medium">
                      {calculateItemPrice(item)}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="border-t p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total estimado</span>
                <span className="text-lg font-bold">
                  R$ {totalPrice.toFixed(2)}
                </span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs flex gap-1"
                  onClick={onClearCart}
                >
                  <Trash className="h-3.5 w-3.5" />
                  Limpar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs flex gap-1"
                  onClick={refreshAvailability}
                  disabled={isLoading}
                >
                  <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
                  Atualizar
                </Button>
              </div>
              
              <Button 
                className="w-full"
                onClick={handleCheckout}
                disabled={items.length === 0 || !allAvailable || isLoading}
              >
                Finalizar Reserva
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">Seu carrinho está vazio</h3>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">
              Adicione acomodações para visualizar seu carrinho de reservas.
            </p>
            <SheetClose asChild>
              <Button variant="outline">Continuar Navegando</Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function calculateItemPrice(item: CartItem): string {
  let totalNights = 0;
  
  item.details.persons.forEach(person => {
    if (person.dateRange.from && person.dateRange.to) {
      const nights = Math.ceil(
        (person.dateRange.to.getTime() - person.dateRange.from.getTime()) / (1000 * 60 * 60 * 24)
      );
      totalNights += nights;
    }
  });
  
  const total = item.room.price * totalNights;
  
  if (totalNights > 0) {
    return `R$ ${total.toFixed(2)} (${totalNights} ${totalNights === 1 ? 'diária' : 'diárias'})`;
  } else {
    return `R$ ${item.room.price.toFixed(2)} / diária`;
  }
}
