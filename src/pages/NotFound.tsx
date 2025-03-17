
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <div className="glass-card rounded-xl p-8 md:p-12 text-center max-w-md animate-fade-in">
        <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
        <p className="text-xl text-foreground mb-6">
          Página não encontrada
        </p>
        <p className="text-muted-foreground mb-8">
          Desculpe, não conseguimos encontrar a página que você está procurando.
        </p>
        <Button asChild>
          <a href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
