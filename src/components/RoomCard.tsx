
import * as React from "react";
import { Expand, X, Calendar, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RoomCarousel } from "@/components/RoomCarousel";
import { Amenities, Amenity } from "@/components/Amenities";
import { RoomDetailsForm, RoomDetailsData } from "@/components/RoomDetailsForm";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { differenceInDays, format } from "date-fns";

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  media: Array<{
    type: "image" | "video";
    src: string;
    thumbnail?: string;
  }>;
  price: number;
  priceUnit: string;
  available: boolean;
  maxGuests: number;
  amenities: Amenity[];
}

interface RoomCardProps {
  room: Room;
  onAddToCart: (room: Room, details: RoomDetailsData) => void;
  onReserveDirect: (room: Room, details: RoomDetailsData) => void;
  defaultDateRange?: DateRange;
}

export function RoomCard({ room, onAddToCart, onReserveDirect, defaultDateRange }: RoomCardProps) {
  const [expanded, setExpanded] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const handleExpand = () => {
    setIsAnimating(true);
    setExpanded(true);
  };

  const handleCollapse = () => {
    setIsAnimating(true);
    setExpanded(false);
  };

  const handleAddToCart = (details: RoomDetailsData) => {
    onAddToCart(room, details);
    handleCollapse();
    toast.success("Acomodação adicionada ao carrinho");
  };
  
  const handleReserveDirect = (details: RoomDetailsData) => {
    onReserveDirect(room, details);
    handleCollapse();
    toast.success("Processando sua reserva...");
  };

  const handleAnimationEnd = () => {
    setIsAnimating(false);
  };

  // Calcular o número de noites e o preço total para o período selecionado
  const calculatePriceDetails = () => {
    if (defaultDateRange?.from && defaultDateRange?.to) {
      const nights = differenceInDays(defaultDateRange.to, defaultDateRange.from);
      const totalPrice = room.price * nights;
      const formattedDateFrom = format(defaultDateRange.from, "dd/MM/yyyy");
      const formattedDateTo = format(defaultDateRange.to, "dd/MM/yyyy");
      
      return {
        nights,
        totalPrice,
        dateRange: `${formattedDateFrom} a ${formattedDateTo}`
      };
    }
    
    return null;
  };
  
  const priceDetails = calculatePriceDetails();
  const hasDateRange = Boolean(defaultDateRange?.from && defaultDateRange?.to);

  return (
    <Card 
      className={cn(
        "room-card overflow-hidden",
        expanded ? "md:col-span-2" : "",
        isAnimating && "transition-all duration-300 ease-in-out"
      )}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="relative">
        <RoomCarousel 
          media={room.media} 
          className="h-64"
        />
        {expanded && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full z-10"
            onClick={handleCollapse}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <CardContent className={cn("p-5", expanded ? "" : "")}>
        <div className={expanded ? "md:grid md:grid-cols-2 md:gap-6 mb-6" : "space-y-4"}>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-xl font-medium">{room.name}</h3>
                <Badge variant={room.available ? "outline" : "secondary"} className="ml-2">
                  {room.available ? "Disponível" : "Indisponível"}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm line-clamp-2">
                {room.description}
              </p>
            </div>

            <div className="space-y-3">
              <div>
                {hasDateRange ? (
                  priceDetails && (
                    <div>
                      <div className="text-2xl font-semibold">
                        R$ {priceDetails.totalPrice}
                        <span className="text-sm font-normal text-muted-foreground ml-1">
                          / por {priceDetails.nights} {priceDetails.nights === 1 ? 'noite' : 'noites'}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Para até {room.maxGuests} hóspedes de {priceDetails.dateRange}
                      </p>
                    </div>
                  )
                ) : (
                  <div className="flex items-center p-3 bg-muted/40 rounded-md text-muted-foreground">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Selecione as datas</p>
                      <p className="text-xs">Para ver os preços, selecione as datas de check-in e check-out</p>
                    </div>
                  </div>
                )}
              </div>

              <Amenities 
                amenities={room.amenities} 
                compact={!expanded}
              />
            </div>
          </div>

          {expanded && (
            <div className="mt-4 md:mt-0">
              <RoomDetailsForm
                onClose={handleCollapse}
                onSubmit={handleAddToCart}
                onReserveDirect={handleReserveDirect}
                defaultDateRange={defaultDateRange}
              />
            </div>
          )}
        </div>
        
        {/* Guest details section in full width when expanded */}
        {expanded && (
          <div className="border-t pt-6">
            {/* Content will be rendered by RoomDetailsForm */}
          </div>
        )}
      </CardContent>

      {!expanded && (
        <CardFooter className="px-5 pb-5 pt-0">
          <div className="flex gap-2 w-full">
            <Button 
              className="flex-1"
              variant="outline"
              onClick={handleExpand}
              disabled={!room.available}
            >
              {room.available ? "Adicionar ao Carrinho" : "Indisponível"}
            </Button>
            <Button 
              className="flex-1"
              onClick={handleExpand}
              disabled={!room.available}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              {room.available ? "Reservar" : "Indisponível"}
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
