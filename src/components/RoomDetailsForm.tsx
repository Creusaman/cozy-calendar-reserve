
import * as React from "react";
import { format } from "date-fns";
import { X, Check, Calendar, Users, ShoppingCart, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { DateRangePicker } from "@/components/DateRangePicker";
import { PersonCounter } from "@/components/PersonCounter";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface Person {
  id: string;
  name: string;
  dateRange: DateRange;
}

interface RoomDetailsFormProps {
  onClose: () => void;
  onSubmit: (data: RoomDetailsData) => void;
  onDirectCheckout?: (data: RoomDetailsData) => void;
  defaultDateRange?: DateRange;
}

export interface RoomDetailsData {
  adults: number;
  children: number;
  pets: number;
  persons: Person[];
  useIndividualDates: boolean;
  mainDateRange: DateRange;
}

export function RoomDetailsForm({ onClose, onSubmit, onDirectCheckout, defaultDateRange }: RoomDetailsFormProps) {
  const [adults, setAdults] = React.useState(2);
  const [children, setChildren] = React.useState(0);
  const [pets, setPets] = React.useState(0);
  const [useIndividualDates, setUseIndividualDates] = React.useState(false);
  const [mainDateRange, setMainDateRange] = React.useState<DateRange>(
    defaultDateRange || { from: undefined, to: undefined }
  );
  const [persons, setPersons] = React.useState<Person[]>([
    { id: "1", name: "", dateRange: { ...mainDateRange } },
    { id: "2", name: "", dateRange: { ...mainDateRange } },
  ]);

  const addPerson = () => {
    if (persons.length < adults + children) {
      setPersons([
        ...persons,
        { 
          id: Date.now().toString(),
          name: "",
          dateRange: { ...mainDateRange }
        }
      ]);
    }
  };

  const removePerson = (id: string) => {
    if (persons.length > 1) {
      setPersons(persons.filter(person => person.id !== id));
    }
  };

  const updatePersonName = (id: string, name: string) => {
    setPersons(
      persons.map(person => 
        person.id === id ? { ...person, name } : person
      )
    );
  };

  const updatePersonDateRange = (id: string, dateRange: DateRange) => {
    setPersons(
      persons.map(person => 
        person.id === id ? { ...person, dateRange } : person
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      adults,
      children,
      pets,
      persons: persons.slice(0, adults + children),
      useIndividualDates,
      mainDateRange
    });
  };

  const handleDirectCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (onDirectCheckout) {
      onDirectCheckout({
        adults,
        children,
        pets,
        persons: persons.slice(0, adults + children),
        useIndividualDates,
        mainDateRange
      });
    }
  };

  // Update all persons' date ranges when main date range changes and individual dates are not used
  React.useEffect(() => {
    if (!useIndividualDates) {
      setPersons(persons.map(person => ({
        ...person,
        dateRange: { ...mainDateRange }
      })));
    }
  }, [mainDateRange, useIndividualDates]);

  // Adjust persons array when adults or children change
  React.useEffect(() => {
    const totalPeople = adults + children;
    
    if (persons.length > totalPeople) {
      // Remove excess persons
      setPersons(persons.slice(0, totalPeople));
    } else if (persons.length < totalPeople) {
      // Add required persons
      const newPersons = [...persons];
      for (let i = persons.length; i < totalPeople; i++) {
        newPersons.push({
          id: Date.now().toString() + i,
          name: "",
          dateRange: useIndividualDates ? { from: undefined, to: undefined } : { ...mainDateRange }
        });
      }
      setPersons(newPersons);
    }
  }, [adults, children]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-1">
      <div className="space-y-3">
        <div className="p-3 border rounded-lg bg-muted/30">
          <div className="mb-2">
            <Label className="text-sm">Período da estadia</Label>
            <DateRangePicker
              dateRange={mainDateRange}
              onChange={setMainDateRange}
              className="w-full mt-1"
            />
          </div>
          
          <div className="flex items-center space-x-2 mt-3">
            <Switch
              id="individual-dates"
              checked={useIndividualDates}
              onCheckedChange={setUseIndividualDates}
            />
            <Label htmlFor="individual-dates" className="text-xs cursor-pointer">
              Individualizar datas de check-in e check-out
            </Label>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-1">
            <PersonCounter
              label="Adultos"
              value={adults}
              onChange={setAdults}
              min={1}
              max={8}
              compact
            />
          </div>
          <div className="col-span-1">
            <PersonCounter
              label="Crianças"
              value={children}
              onChange={setChildren}
              max={6}
              compact
            />
          </div>
          <div className="col-span-1">
            <PersonCounter
              label="Animais"
              value={pets}
              onChange={setPets}
              max={3}
              compact
            />
          </div>
        </div>
      </div>

      {(adults + children > 0) && (
        <div className="border-t pt-3">
          <h3 className="text-sm font-medium mb-2">Detalhes dos hóspedes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {persons.map((person, index) => (
              <div key={person.id} className="p-2 border rounded-lg bg-muted/30">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-xs font-medium">
                    {index === 0 ? "Hóspede principal" : `Hóspede ${index + 1}`}
                  </h4>
                  {persons.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removePerson(person.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      value={person.name}
                      onChange={(e) => updatePersonName(person.id, e.target.value)}
                      placeholder=" "
                      className="h-9 pt-4 px-3 pb-1"
                    />
                    <label className="absolute text-xs text-muted-foreground left-3 top-1 pointer-events-none">
                      Nome do hóspede
                    </label>
                  </div>
                  
                  {useIndividualDates && (
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Período da estadia</label>
                      <DateRangePicker
                        dateRange={person.dateRange}
                        onChange={(range) => updatePersonDateRange(person.id, range)}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1"
          size="sm"
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="flex-1"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4 mr-1" />
          Carrinho
        </Button>
        {onDirectCheckout && (
          <Button 
            type="button"
            onClick={handleDirectCheckout}
            className="flex-1"
            variant="secondary"
            size="sm"
          >
            <CreditCard className="h-4 w-4 mr-1" />
            Reservar
          </Button>
        )}
      </div>
    </form>
  );
}
