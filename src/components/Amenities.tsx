
import * as React from "react";
import { Wifi, Tv, Coffee, Utensils, Shower, Wind, PawPrint, Baby } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Amenity {
  id: string;
  name: string;
  icon: keyof typeof amenityIcons;
}

const amenityIcons = {
  wifi: Wifi,
  tv: Tv,
  coffee: Coffee,
  restaurant: Utensils,
  shower: Shower,
  ac: Wind,
  petFriendly: PawPrint,
  kidFriendly: Baby
};

interface AmenitiesProps {
  amenities: Amenity[];
  className?: string;
  compact?: boolean;
}

export function Amenities({ amenities, className, compact = false }: AmenitiesProps) {
  const visibleAmenities = compact ? amenities.slice(0, 4) : amenities;
  const hiddenCount = compact && amenities.length > 4 ? amenities.length - 4 : 0;

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {visibleAmenities.map((amenity) => {
        const Icon = amenityIcons[amenity.icon];
        return (
          <div key={amenity.id} className="amenity-item">
            <Icon className="amenity-icon" />
            <span>{amenity.name}</span>
          </div>
        );
      })}
      
      {hiddenCount > 0 && (
        <div className="amenity-item text-muted-foreground">
          <span>+{hiddenCount} mais</span>
        </div>
      )}
    </div>
  );
}
