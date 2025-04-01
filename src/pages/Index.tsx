
import * as React from "react";
import { DateRangePicker } from "@/components/DateRangePicker";
import { RoomCard, Room, DateRange } from "@/components/RoomCard";
import { PersonCounter } from "@/components/PersonCounter";
import { CartSidebar, CartItem } from "@/components/CartSidebar";
import { RoomDetailsData } from "@/components/RoomDetailsForm";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PromotionalBanner from "@/components/PromotionalBanner";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Calendar, Users } from "lucide-react";

const dummyRooms: Room[] = [
  {
    id: "1",
    name: "Suíte Premium com Vista para o Mar",
    description: "Suíte luxuosa com uma vista deslumbrante para o mar, varanda privativa e banheira de hidromassagem.",
    media: [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        type: "video",
        src: "https://assets.mixkit.co/videos/preview/mixkit-white-sand-beach-and-palm-trees-1564-large.mp4",
        thumbnail: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
    ],
    price: 850,
    priceUnit: "noite",
    available: true,
    maxGuests: 3,
    amenities: [
      { id: "1", name: "Wi-Fi", icon: "wifi" },
      { id: "2", name: "TV 4K", icon: "tv" },
      { id: "3", name: "Cafeteira", icon: "coffee" },
      { id: "4", name: "Restaurante", icon: "restaurant" },
      { id: "5", name: "Banheira", icon: "bath" },
      { id: "6", name: "Ar-condicionado", icon: "ac" },
    ],
  },
  {
    id: "2",
    name: "Chalé Familiar na Montanha",
    description: "Chalé aconchegante com lareira, ideal para famílias que buscam conforto e contato com a natureza.",
    media: [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
    ],
    price: 620,
    priceUnit: "noite",
    available: true,
    maxGuests: 5,
    amenities: [
      { id: "1", name: "Wi-Fi", icon: "wifi" },
      { id: "2", name: "TV", icon: "tv" },
      { id: "3", name: "Cafeteira", icon: "coffee" },
      { id: "4", name: "Pet-friendly", icon: "petFriendly" },
      { id: "5", name: "Kid-friendly", icon: "kidFriendly" },
    ],
  },
  {
    id: "3",
    name: "Bangalô Tropical com Piscina Privativa",
    description: "Bangalô espaçoso em meio a um jardim tropical, com piscina privativa e terraço para refeições ao ar livre.",
    media: [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        type: "video",
        src: "https://assets.mixkit.co/videos/preview/mixkit-swimming-pool-from-the-bottom-underwater-view-1509-large.mp4",
        thumbnail: "https://images.unsplash.com/photo-1561501900-3701fa6a0864?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
    ],
    price: 1200,
    priceUnit: "noite",
    available: false,
    maxGuests: 4,
    amenities: [
      { id: "1", name: "Wi-Fi", icon: "wifi" },
      { id: "2", name: "TV", icon: "tv" },
      { id: "3", name: "Piscina", icon: "bath" },
      { id: "4", name: "Ar-condicionado", icon: "ac" },
      { id: "5", name: "Pet-friendly", icon: "petFriendly" },
    ],
  },
  {
    id: "4",
    name: "Apartamento Executivo no Centro",
    description: "Apartamento moderno e bem equipado, localizado no centro da cidade com acesso fácil a atrações turísticas e restaurantes.",
    media: [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
    ],
    price: 450,
    priceUnit: "noite",
    available: true,
    maxGuests: 2,
    amenities: [
      { id: "1", name: "Wi-Fi", icon: "wifi" },
      { id: "2", name: "TV", icon: "tv" },
      { id: "3", name: "Cafeteira", icon: "coffee" },
      { id: "4", name: "Ar-condicionado", icon: "ac" },
    ],
  },
];

const Index = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [adults, setAdults] = React.useState(2);
  const [children, setChildren] = React.useState(0);
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [rooms, setRooms] = React.useState<Room[]>(dummyRooms);
  const [stickyTop, setStickyTop] = React.useState(0);
  const accommodationsRef = React.useRef<HTMLElement>(null);
  const sidebarRef = React.useRef<HTMLDivElement>(null);

  const handleAddToCart = (room: Room, details: RoomDetailsData) => {
    setCartItems([
      ...cartItems,
      {
        room,
        details,
        id: `${room.id}-${Date.now()}`,
      },
    ]);
  };

  const handleReserveDirect = (room: Room, details: RoomDetailsData) => {
    // First add to cart
    const newItem = {
      room,
      details,
      id: `${room.id}-${Date.now()}`,
    };
    
    setCartItems([...cartItems, newItem]);
    
    // Then simulate checkout
    toast.success("Redirecionando para o checkout...");
    setTimeout(() => {
      navigate("/");
      toast.info("Funcionalidade de reserva direta não implementada nesta versão");
    }, 1500);
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCheckoutClick = () => {
    // Normally this would navigate to a checkout page
    toast.success("Redirecionando para o checkout...");
    setTimeout(() => {
      navigate("/");
      toast.info("Funcionalidade de checkout não implementada nesta versão");
    }, 1500);
  };

  const checkAvailability = async (): Promise<boolean> => {
    // Simulate an API call to check availability
    return new Promise((resolve) => {
      setTimeout(() => {
        // Randomly make some rooms unavailable to demonstrate the feature
        const updatedRooms = rooms.map(room => ({
          ...room,
          available: room.id === "3" ? false : room.available,
        }));
        
        setRooms(updatedRooms);
        
        // Check if all items in cart are still available
        const allAvailable = cartItems.every(item => {
          const currentRoom = updatedRooms.find(r => r.id === item.room.id);
          return currentRoom?.available;
        });
        
        resolve(allAvailable);
      }, 1500);
    });
  };

  // Update the sidebar position when scrolling
  React.useEffect(() => {
    const handleScroll = () => {
      if (!accommodationsRef.current || !sidebarRef.current) return;
      
      const sectionRect = accommodationsRef.current.getBoundingClientRect();
      const sidebarHeight = sidebarRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      // Calculate section boundaries
      const sectionTop = sectionRect.top;
      const sectionBottom = sectionRect.bottom;
      
      // Calculate the maximum position where sidebar can be positioned
      // without overflowing out of the section
      const maxPositionFromTop = sectionBottom - sidebarHeight;
      
      if (sectionTop <= 0) {
        // Section is scrolled up at least to the top of viewport
        
        if (maxPositionFromTop <= 0) {
          // Sidebar is taller than remaining section height, so pin it to bottom
          setStickyTop(Math.abs(sectionTop) + (maxPositionFromTop));
        } else {
          // Normal sticky behavior, pin to top with padding
          setStickyTop(Math.abs(sectionTop) + 20);
        }
      } else {
        // Section is below viewport top
        setStickyTop(0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial positioning
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [accommodationsRef.current, sidebarRef.current]);

  const dateSelected = Boolean(dateRange.from && dateRange.to);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <header className="sticky top-0 z-20 backdrop-blur-sm bg-background/80 border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Elegante Hospedagem</h1>
          <CartSidebar
            items={cartItems}
            onRemoveItem={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onCheckoutClick={handleCheckoutClick}
            checkAvailability={checkAvailability}
          />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Promotional Banner */}
        <PromotionalBanner />
        
        <section className="mb-12 max-w-4xl mx-auto">
          <div className="glass-card rounded-xl p-6 md:p-8 space-y-6 animate-fade-in">
            <h2 className="text-2xl font-medium text-center mb-6">Encontre a acomodação perfeita</h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Período da estadia</label>
                <DateRangePicker 
                  dateRange={dateRange}
                  onChange={setDateRange}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hóspedes</label>
                <div className="border rounded-md p-3 space-y-3">
                  <PersonCounter
                    label="Adultos"
                    value={adults}
                    onChange={setAdults}
                    min={1}
                  />
                  <PersonCounter
                    label="Crianças"
                    value={children}
                    onChange={setChildren}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
          
        <section ref={accommodationsRef} className="relative">
          <h2 className="text-2xl font-medium mb-6">Acomodações disponíveis</h2>
          
          <div className="grid md:grid-cols-[280px_1fr] gap-6">
            {/* Barra lateral fixa */}
            <div 
              ref={sidebarRef}
              className="sticky-filters hidden md:block" 
              style={{ 
                position: 'sticky',
                top: `${Math.max(20, stickyTop)}px`,
                height: 'fit-content',
                maxHeight: 'calc(100vh - 40px)',
                overflowY: 'auto',
                transition: 'top 0.2s ease'
              }}
            >
              <Card className="sticky-sidebar">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-primary" />
                    Filtros
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">Período da estadia</label>
                    <DateRangePicker 
                      dateRange={dateRange}
                      onChange={setDateRange}
                      className="w-full"
                    />
                    {!dateSelected && (
                      <p className="mt-2 text-xs text-amber-600 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Selecione as datas para ver os preços
                      </p>
                    )}
                  </div>
                  
                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium mb-2 flex items-center">
                      <Users className="mr-2 h-4 w-4 text-primary" />
                      Hóspedes
                    </label>
                    <div className="space-y-3">
                      <PersonCounter
                        label="Adultos"
                        value={adults}
                        onChange={setAdults}
                        min={1}
                      />
                      <PersonCounter
                        label="Crianças"
                        value={children}
                        onChange={setChildren}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Grid de acomodações */}
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
              {rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onAddToCart={handleAddToCart}
                  onReserveDirect={handleReserveDirect}
                  defaultDateRange={dateRange}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-secondary text-secondary-foreground py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-80">
            © {new Date().getFullYear()} Elegante Hospedagem. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
