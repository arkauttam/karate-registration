import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentSummary } from "@/types/student";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  BookOpen, 
  Utensils, 
  Wheat, 
  Shirt, 
  TrendingUp,
  Award,
  Sparkles
} from "lucide-react";

interface SummaryCardsProps {
  summary: StudentSummary;
}

export const SummaryCards = ({ summary }: SummaryCardsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      title: "Total Students",
      value: summary.totalStudents.toString(),
      icon: Users,
      gradient: "from-blue-500/10 to-blue-600/5",
      iconBg: "bg-blue-500/10 text-blue-600",
      border: "border-blue-500/20",
      glowColor: "group-hover:shadow-blue-500/20"
    },
    {
      title: "Exam Fees",
      value: formatCurrency(summary.totalExamFees),
      icon: BookOpen,
      gradient: "from-purple-500/10 to-purple-600/5",
      iconBg: "bg-purple-500/10 text-purple-600",
      border: "border-purple-500/20",
      glowColor: "group-hover:shadow-purple-500/20"
    },
    {
      title: "Food Fees", 
      value: formatCurrency(summary.totalFoodFees),
      icon: Utensils,
      gradient: "from-green-500/10 to-green-600/5",
      iconBg: "bg-green-500/10 text-green-600",
      border: "border-green-500/20",
      glowColor: "group-hover:shadow-green-500/20"
    },
    {
      title: "Rice Fees",
      value: formatCurrency(summary.totalRice),
      icon: Wheat,
      gradient: "from-orange-500/10 to-orange-600/5",
      iconBg: "bg-orange-500/10 text-orange-600",
      border: "border-orange-500/20",
      glowColor: "group-hover:shadow-orange-500/20"
    },
    {
      title: "Gargent Fees",
      value: formatCurrency(summary.totalGargentFees),
      icon: Shirt,
      gradient: "from-pink-500/10 to-pink-600/5",
      iconBg: "bg-pink-500/10 text-pink-600",
      border: "border-pink-500/20",
      glowColor: "group-hover:shadow-pink-500/20"
    },
    {
      title: "Grand Total",
      value: formatCurrency(summary.grandTotal),
      icon: TrendingUp,
      gradient: "from-primary/20 to-primary-glow/10",
      iconBg: "bg-primary/10 text-primary",
      border: "border-primary/30",
      isHighlight: true,
      glowColor: "group-hover:shadow-primary/30"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card 
            key={card.title}
            className={`group relative overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-1 ${
              card.isHighlight 
                ? 'shadow-[var(--shadow-elegant)] border-primary/30 bg-gradient-to-br from-primary/5 to-primary-glow/5' 
                : 'shadow-[var(--shadow-card)] border-border/50 bg-gradient-to-br ' + card.gradient
            } ${card.border} backdrop-blur-sm hover:shadow-xl ${card.glowColor}`}
          >
            {card.isHighlight && (
              <>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary-glow to-admin-primary"></div>
                <div className="absolute top-2 right-2">
                  <Sparkles className="w-4 h-4 text-primary/60 animate-pulse" />
                </div>
              </>
            )}
            
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </p>
                  {card.title === "Total Students" && summary.totalStudents > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground/80">
                      <Award className="w-3 h-3" />
                      <span>Registered</span>
                    </div>
                  )}
                </div>
                <div className={`p-3 rounded-xl ${card.iconBg} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              
              <div className="flex items-baseline gap-2">
                <div className={`text-2xl font-bold ${
                  card.isHighlight ? 'text-primary' : 'text-foreground'
                } transition-all duration-300 group-hover:scale-105`}>
                  {card.value}
                </div>
                {card.isHighlight && (
                  <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20 animate-pulse">
                    Total
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
