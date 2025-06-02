import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TECHNICAL_PATTERNS } from "@/lib/aiTrading";

const TechnicalPatterns: React.FC = () => {
  const { toast } = useToast();
  
  const handleViewAll = () => {
    toast({
      title: "View All Patterns",
      description: "The full pattern analysis feature is in development",
    });
  };

  return (
    <Card className="bg-card shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle>Technical Patterns</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Technical chart with patterns */}
        <div className="w-full h-auto rounded-lg mb-3 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250" 
            alt="Technical chart with patterns" 
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>
        
        <div className="space-y-2 mt-3">
          {TECHNICAL_PATTERNS.slice(0, 3).map((pattern, index) => (
            <div key={index} className="flex items-center">
              <span 
                className="w-2 h-2 rounded-full mr-2" 
                style={{ backgroundColor: pattern.color }}
              ></span>
              <span className="text-sm">{pattern.pattern} - {pattern.symbol}</span>
            </div>
          ))}
        </div>
        
        <Button 
          onClick={handleViewAll}
          variant="outline" 
          className="w-full bg-primary hover:bg-primary-dark text-foreground border border-muted mt-4"
        >
          View All Patterns
        </Button>
      </CardContent>
    </Card>
  );
};

export default TechnicalPatterns;
