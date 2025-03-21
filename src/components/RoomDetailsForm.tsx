
import * as React from "react";
import { format } from "date-fns";
import { X, Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateRangePicker } from "@/components/DateRangePicker";
import { PersonCounter } from "@/components/PersonCounter";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
  globalDateRange?: DateRange;
  maxGuests?: number;
}

export interface RoomDetailsData {
  adults: number;
  children: number;
  pets: number;
  persons: Person[];
  useIndividualDates: boolean;
}

export function RoomDetailsForm({ onClose, onSubmit, globalDateRange, maxGuests = 8 }: RoomDetailsFormProps) {
  const [adults, setAdults] = React.useState(2);
  const [children, setChildren] = React.useState(0);
  const [pets, setPets] = React.useState(0);
  const [useIndividualDates, setUseIndividualDates] = React.useState(false);
  const [persons, setPersons] = React.useState<Person[]>([
    { id: "1", name: "", dateRange: globalDateRange || { from: undefined, to: undefined } },
    { id: "2", name: "", dateRange: globalDateRange || { from: undefined, to: undefined } },
  ]);

  const addPerson = () => {
    if (persons.length < adults + children) {
      setPersons([
        ...persons,
        { 
          id: Date.now().toString(),
          name: "",
          dateRange: globalDateRange || { from: undefined, to: undefined }
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
      useIndividualDates
    });
  };

  // Apply global date range to all persons when it changes
  React.useEffect(() => {
    if (globalDateRange && !useIndividualDates) {
      setPersons(prevPersons => 
        prevPersons.map(person => ({
          ...person,
          dateRange: globalDateRange
        }))
      );
    }
  }, [globalDateRange, useIndividualDates]);

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
          dateRange: globalDateRange || { from: undefined, to: undefined }
        });
      }
      setPersons(newPersons);
    }
  }, [adults, children, globalDateRange]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-1">
      <div className="space-y-4">
        <PersonCounter
          label="Adultos"
          value={adults}
          onChange={setAdults}
          min={1}
          max={maxGuests || 8}
        />
        <PersonCounter
          label="Crianças"
          value={children}
          onChange={setChildren}
          max={maxGuests ? maxGuests - 1 : 6}
        />
        <PersonCounter
          label="Animais"
          value={pets}
          onChange={setPets}
          max={3}
        />
      </div>

      <div className="border-t pt-4">
        <h3 className="text-sm font-medium mb-3">Detalhes dos hóspedes</h3>
        
        <div className="flex items-center space-x-2 mb-4">
          <Switch 
            id="individual-dates" 
            checked={useIndividualDates}
            onCheckedChange={setUseIndividualDates}
          />
          <Label htmlFor="individual-dates">Individualizar datas de check-in e check-out</Label>
        </div>
        
        <div className="space-y-4">
          {persons.map((person, index) => (
            <div key={person.id} className="p-3 border rounded-lg bg-muted/30">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm">
                  {index === 0 ? "Hóspede principal" : `Hóspede ${index + 1}`}
                </h4>
                {persons.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => removePerson(person.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Nome</label>
                  <Input
                    value={person.name}
                    onChange={(e) => updatePersonName(person.id, e.target.value)}
                    placeholder="Nome do hóspede"
                    className="h-9 mt-1"
                  />
                </div>
                {useIndividualDates && (
                  <div>
                    <label className="text-xs text-muted-foreground">Período da estadia</label>
                    <DateRangePicker
                      dateRange={person.dateRange}
                      onChange={(range) => updatePersonDateRange(person.id, range)}
                      className="w-full mt-1"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button type="submit" className="flex-1">
          Adicionar ao carrinho
        </Button>
      </div>
    </form>
  );
}
