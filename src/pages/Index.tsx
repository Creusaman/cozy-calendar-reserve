
import * as React from "react";
import { DateRangePicker } from "@/components/DateRangePicker";
import { RoomCard, Room } from "@/components/RoomCard";
import { PersonCounter } from "@/components/PersonCounter";
import { CartSidebar, CartItem } from "@/components/CartSidebar";
import { RoomDetailsData } from "@/components/RoomDetailsForm";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  ShoppingCart, User, Search, LogIn, Menu, X, Home, 
  CalendarRange, CreditCard, Heart, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

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
  const [pets, setPets] = React.useState(0);
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [rooms, setRooms] = React.useState<Room[]>(dummyRooms);
  const [isUserLoggedIn, setIsUserLoggedIn] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [countdownDays, setCountdownDays] = React.useState(31);
  const [countdownHours, setCountdownHours] = React.useState(12);
  const [countdownMinutes, setCountdownMinutes] = React.useState(30);
  const [countdownSeconds, setCountdownSeconds] = React.useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Simulate countdown timer
  React.useEffect(() => {
    const timer = setInterval(() => {
      if (countdownSeconds > 0) {
        setCountdownSeconds(countdownSeconds - 1);
      } else if (countdownMinutes > 0) {
        setCountdownMinutes(countdownMinutes - 1);
        setCountdownSeconds(59);
      } else if (countdownHours > 0) {
        setCountdownHours(countdownHours - 1);
        setCountdownMinutes(59);
        setCountdownSeconds(59);
      } else if (countdownDays > 0) {
        setCountdownDays(countdownDays - 1);
        setCountdownHours(23);
        setCountdownMinutes(59);
        setCountdownSeconds(59);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [countdownDays, countdownHours, countdownMinutes, countdownSeconds]);

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

  const handleRemoveFromCart = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCheckoutClick = () => {
    // Navigate to checkout page
    navigate("/checkout");
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

  const handleLogin = (method: string) => {
    toast.success(`Login via ${method} iniciado`);
    setTimeout(() => {
      setIsUserLoggedIn(true);
      if (method === 'Google') {
        setIsAdmin(true);
      }
      toast.success("Login realizado com sucesso!");
    }, 1500);
  };

  const handleLogout = () => {
    setIsUserLoggedIn(false);
    setIsAdmin(false);
    toast.success("Logout realizado com sucesso!");
  };

  const sortRooms = () => {
    // Sort rooms based on availability, capacity and pet-friendliness
    const sortedRooms = [...rooms].sort((a, b) => {
      // First sort by availability
      if (a.available && !b.available) return -1;
      if (!a.available && b.available) return 1;
      
      // Then sort by capacity vs selected guests
      const totalGuests = adults + children;
      const aFitsGuests = a.maxGuests >= totalGuests;
      const bFitsGuests = b.maxGuests >= totalGuests;
      
      if (aFitsGuests && !bFitsGuests) return -1;
      if (!aFitsGuests && bFitsGuests) return 1;
      
      // Then sort by whether they accept pets if pets are selected
      if (pets > 0) {
        const aAcceptsPets = a.amenities.some(amenity => amenity.icon === 'petFriendly');
        const bAcceptsPets = b.amenities.some(amenity => amenity.icon === 'petFriendly');
        
        if (aAcceptsPets && !bAcceptsPets) return -1;
        if (!aAcceptsPets && bAcceptsPets) return 1;
      }
      
      return 0;
    });
    
    return sortedRooms;
  };

  const sortedRooms = sortRooms();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Mobile Menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-[250px] sm:w-[300px]">
          <nav className="flex flex-col h-full">
            <div className="py-4 border-b">
              <h2 className="text-lg font-semibold px-4">Elegante Hospedagem</h2>
            </div>
            <div className="py-4 flex-1 space-y-1">
              <SheetClose asChild>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="#"><Home className="mr-2 h-4 w-4" /> Início</a>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="#"><Search className="mr-2 h-4 w-4" /> Buscar</a>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="#"><Heart className="mr-2 h-4 w-4" /> Favoritos</a>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="#"><CalendarRange className="mr-2 h-4 w-4" /> Minhas Reservas</a>
                </Button>
              </SheetClose>
            </div>
            <div className="py-4 border-t">
              {isUserLoggedIn ? (
                <Button variant="outline" className="w-full" onClick={handleLogout}>
                  Sair
                </Button>
              ) : (
                <div className="space-y-2 px-4">
                  <Button className="w-full" onClick={() => handleLogin('Google')}>
                    Login com Google
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => handleLogin('WhatsApp')}>
                    Login com WhatsApp
                  </Button>
                </div>
              )}
            </div>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop header */}
      <header className="sticky top-0 z-10 backdrop-blur-sm bg-background/80 border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <h1 className="text-2xl font-bold">Elegante Hospedagem</h1>
            
            {/* Desktop navigation */}
            <NavigationMenu className="hidden md:flex ml-6">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
                    Início
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Acomodações</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="#"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Ofertas Especiais
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Confira nossas ofertas exclusivas e descontos para sua próxima estadia.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a href="#" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium">Bangalôs</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Acomodações espaçosas com piscina privativa.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a href="#" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium">Chalés</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Experiência aconchegante em meio à natureza.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a href="#" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium">Suítes Premium</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              O máximo de conforto com vista para o mar.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
                    Experiências
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
                    Contato
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-3">
            {isUserLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <a href="#" className="cursor-pointer">Perfil</a>
                  </DropdownMenuItem>
                  {isAdmin ? (
                    <>
                      <DropdownMenuItem asChild>
                        <a href="#" className="cursor-pointer">Painel de Administrador</a>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href="#" className="cursor-pointer">Administrar Acomodações</a>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem asChild>
                      <a href="#" className="cursor-pointer">Minhas Reservas</a>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden md:flex">
                    <LogIn className="mr-2 h-4 w-4" />
                    Entrar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleLogin('Google')}>
                    Login via Google
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleLogin('WhatsApp')}>
                    Login via WhatsApp
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleLogin('Instagram')}>
                    Login via Instagram
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <CartSidebar
              items={cartItems}
              onRemoveItem={handleRemoveFromCart}
              onClearCart={handleClearCart}
              onCheckoutClick={handleCheckoutClick}
              checkAvailability={checkAvailability}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Promotional Banner with Countdown */}
        <section className="mb-12">
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/30 z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Reveillon celebration" 
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white p-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Reveillon 2024</h2>
                <p className="text-lg md:text-xl max-w-xl mb-6">Garanta já sua estadia para a melhor virada de ano da sua vida!</p>
                
                <div className="grid grid-cols-4 gap-3 mb-6">
                  <div className="flex flex-col items-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg w-16 h-16 flex items-center justify-center text-2xl font-bold">
                      {countdownDays}
                    </div>
                    <span className="text-sm mt-1">Dias</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg w-16 h-16 flex items-center justify-center text-2xl font-bold">
                      {countdownHours}
                    </div>
                    <span className="text-sm mt-1">Horas</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg w-16 h-16 flex items-center justify-center text-2xl font-bold">
                      {countdownMinutes}
                    </div>
                    <span className="text-sm mt-1">Minutos</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg w-16 h-16 flex items-center justify-center text-2xl font-bold">
                      {countdownSeconds}
                    </div>
                    <span className="text-sm mt-1">Segundos</span>
                  </div>
                </div>
                
                <Button className="bg-white text-primary hover:bg-white/90">
                  Reservar Agora!
                </Button>
              </div>
            </div>
          </div>
        </section>

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
                  <PersonCounter
                    label="Animais"
                    value={pets}
                    onChange={setPets}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
          
        <section>
          <h2 className="text-2xl font-medium mb-6">Acomodações disponíveis</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {sortedRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onAddToCart={handleAddToCart}
                globalDateRange={dateRange}
              />
            ))}
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
