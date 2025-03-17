
import * as React from "react";
import { Expand, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RoomCarousel } from "@/components/RoomCarousel";
import { Amenities, Amenity } from "@/components/Amenities";
import { RoomDetailsForm, RoomDetailsData } from "@/components/RoomDetailsForm";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface RoomCardProps {
  room: Room;
  onAddToCart: (room: Room, details: RoomDetailsData) => void;
  globalDateRange?: DateRange;
}

export function RoomCard({ room, onAddToCart, globalDateRange }: RoomCardProps) {
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

  const handleAnimationEnd = () => {
    setIsAnimating(false);
  };

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

      <CardContent className={cn("p-5", expanded ? "md:grid md:grid-cols-2 md:gap-6" : "")}>
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
              <div className="text-2xl font-semibold">
                R$ {room.price}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  / {room.priceUnit}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Para até {room.maxGuests} hóspedes
              </p>
            </div>

            <Amenities 
              amenities={room.amenities} 
              compact={!expanded}
            />
          </div>
        </div>

        {expanded ? (
          <div className="mt-4 md:mt-0">
            <RoomDetailsForm
              onClose={handleCollapse}
              onSubmit={handleAddToCart}
              globalDateRange={globalDateRange}
              maxGuests={room.maxGuests}
            />
          </div>
        ) : null}
      </CardContent>

      {!expanded && (
        <CardFooter className="px-5 pb-5 pt-0">
          <Button 
            className="w-full"
            onClick={handleExpand}
            disabled={!room.available}
          >
            {room.available ? "Reservar" : "Indisponível"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
