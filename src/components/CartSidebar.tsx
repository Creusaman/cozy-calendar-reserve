
import * as React from "react";
import { ShoppingCart, X, AlertCircle, ArrowRight, Trash, Users, UserRound, UserRoundPlus, Baby, Calendar, Edit, RefreshCw } from "lucide-react";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  className?: string;
}

export function CartSidebar({
  items,
  onRemoveItem,
  onClearCart,
  onCheckoutClick,
  checkAvailability,
  className,
}: CartSidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [allAvailable, setAllAvailable] = React.useState(true);
  const [editingItem, setEditingItem] = React.useState<CartItem | null>(null);

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

  // Render guest icons for visually representing occupancy
  const renderGuestIcons = (item: CartItem) => {
    const filledGuests = item.details.persons.filter(p => p.name.trim() !== "").length;
    const adultIcons = [];
    const childIcons = [];
    
    // Create adult icons
    for (let i = 0; i < item.details.adults; i++) {
      const isFilled = i < filledGuests;
      adultIcons.push(
        <div 
          key={`adult-${i}`} 
          className={`rounded-full p-1 ${isFilled ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          title={isFilled ? "Ocupado" : "Vaga disponível"}
        >
          <UserRound className="h-4 w-4" />
        </div>
      );
    }
    
    // Create child icons
    for (let i = 0; i < item.details.children; i++) {
      const isFilled = i < Math.max(0, filledGuests - item.details.adults);
      childIcons.push(
        <div 
          key={`child-${i}`} 
          className={`rounded-full p-1 ${isFilled ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          title={isFilled ? "Ocupado" : "Vaga disponível"}
        >
          <Baby className="h-4 w-4" />
        </div>
      );
    }
    
    return (
      <div className="mt-2">
        <div className="flex flex-wrap gap-1 mb-1">
          {adultIcons}
        </div>
        {childIcons.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {childIcons}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
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
                        <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                          {item.room.media && item.room.media.length > 0 && (
                            <img 
                              src={item.room.media[0].src} 
                              alt={item.room.name} 
                              className="w-full h-full object-cover"
                            />
                          )}
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
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => onRemoveItem(item.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Guest icons representation */}
                          {renderGuestIcons(item)}
                          
                          {/* Date display */}
                          <div className="flex items-center text-xs mt-2">
                            <Calendar className="h-3 w-3 mr-1" />
                            {item.details.mainDateRange.from && item.details.mainDateRange.to ? (
                              <span>
                                {format(item.details.mainDateRange.from, "dd/MM")} a {format(item.details.mainDateRange.to, "dd/MM")}
                                {item.details.useIndividualDates && " (datas individuais)"}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">Datas não definidas</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {!item.room.available && (
                        <div className="bg-destructive/10 rounded p-2 text-xs text-destructive">
                          Indisponível no momento
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">
                          {calculateItemPrice(item)}
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 text-xs"
                          onClick={() => setEditingItem(item)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
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
                    onClick={onClearCart}
                    className="flex-1"
                  >
                    <Trash className="h-4 w-4 mr-1.5" />
                    Limpar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshAvailability}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <RefreshCw className={`h-4 w-4 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
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

      {/* Edit Item Dialog */}
      <Dialog 
        open={editingItem !== null} 
        onOpenChange={(open) => !open && setEditingItem(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Reserva</DialogTitle>
            <DialogDescription>
              Atualize os detalhes da sua reserva
            </DialogDescription>
          </DialogHeader>
          
          {editingItem && (
            <div className="py-4">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                  {editingItem.room.media && editingItem.room.media.length > 0 && (
                    <img 
                      src={editingItem.room.media[0].src} 
                      alt={editingItem.room.name} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{editingItem.room.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Para até {editingItem.room.maxGuests} hóspedes
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm">
                  Para editar os detalhes completos desta reserva, remova-a do carrinho e adicione novamente com as informações atualizadas.
                </p>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingItem(null)}
                  >
                    Fechar
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      if (editingItem) {
                        onRemoveItem(editingItem.id);
                        setEditingItem(null);
                      }
                    }}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Remover
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function calculateItemPrice(item: CartItem): string {
  let totalNights = 0;
  
  if (item.details.useIndividualDates) {
    // For individual dates, sum nights for each person
    item.details.persons.forEach(person => {
      if (person.dateRange.from && person.dateRange.to) {
        const nights = Math.ceil(
          (person.dateRange.to.getTime() - person.dateRange.from.getTime()) / (1000 * 60 * 60 * 24)
        );
        totalNights += nights;
      }
    });
  } else {
    // For common dates, multiply number of people by nights
    if (item.details.mainDateRange.from && item.details.mainDateRange.to) {
      const nights = Math.ceil(
        (item.details.mainDateRange.to.getTime() - item.details.mainDateRange.from.getTime()) / (1000 * 60 * 60 * 24)
      );
      totalNights = nights * item.details.persons.length;
    }
  }
  
  const total = item.room.price * totalNights;
  
  if (totalNights > 0) {
    return `R$ ${total.toFixed(2)} (${totalNights} ${totalNights === 1 ? 'diária' : 'diárias'})`;
  } else {
    return `R$ ${item.room.price.toFixed(2)} / diária`;
  }
}
