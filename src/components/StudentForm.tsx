import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StudentFormData, BELT_LEVELS } from "@/types/student";
import { Plus, Award } from "lucide-react";

interface StudentFormProps {
  onSubmit: (data: StudentFormData) => void;
}

export const StudentForm = ({ onSubmit }: StudentFormProps) => {
  const [formData, setFormData] = useState<StudentFormData>({
    studentName: "",
    beltLevel: "",
    examFees: "",
    foodFees: "",
    rice: "",
    gargentFees: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName.trim() || !formData.beltLevel) return;
    
    onSubmit(formData);
    setFormData({
      studentName: "",
      beltLevel: "",
      examFees: "",
      foodFees: "",
      rice: "",
      gargentFees: "",
    });
  };

  const handleChange = (field: keyof StudentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBeltChange = (beltId: string) => {
    const selectedBelt = BELT_LEVELS.find(belt => belt.id === beltId);
    if (selectedBelt) {
      setFormData(prev => ({ 
        ...prev, 
        beltLevel: beltId,
        examFees: selectedBelt.fee.toString()
      }));
    }
  };

  return (
    <Card className="shadow-[var(--shadow-elegant)] border-border/50 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-primary via-primary-glow to-admin-primary text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
            <Plus className="w-5 h-5" />
          </div>
          Register New Student
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Label htmlFor="studentName" className="text-sm font-semibold text-foreground flex items-center gap-2 text-gray-700">
              Student Name *
            </Label>
            <Input
              id="studentName"
              value={formData.studentName}
              onChange={(e) => handleChange("studentName", e.target.value)}
              placeholder="Enter student full name"
              className="mt-2 h-12 border-2 focus:border-primary transition-all duration-300"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="beltLevel" className="text-sm font-semibold text-foreground flex items-center gap-2 text-gray-700">
              <Award className="w-4 h-4 text-primary" />
              Belt Level *
            </Label>
            <Select value={formData.beltLevel} onValueChange={handleBeltChange}>
              <SelectTrigger className="mt-2 h-12 border-2 focus:border-primary transition-all duration-300">
                <SelectValue placeholder="Select belt level" />
              </SelectTrigger>
              <SelectContent className="bg-card/95 backdrop-blur-lg border-border">
                {BELT_LEVELS.map((belt) => (
                  <SelectItem key={belt.id} value={belt.id} className="focus:bg-primary/10">
                    <div className="flex items-center gap-3 w-full">
                      <div className={`w-4 h-4 rounded-full ${belt.color} border-2`}></div>
                      <div className="flex-1">
                        <span className="font-medium">{belt.name} {belt.kyu}</span>
                        <span className="ml-2 text-sm text-muted-foreground">₹{belt.fee}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="examFees" className="text-sm font-semibold text-foreground text-gray-700">
              Exam Fees (Auto-filled)
            </Label>
            <Input
              id="examFees"
              type="number"
              value={formData.examFees}
              onChange={(e) => handleChange("examFees", e.target.value)}
              placeholder="0.00"
              className="mt-2 h-12 border-2 focus:border-primary transition-all duration-300 bg-muted/30 cursor-not-allowed"
              min="0"
              step="0.01"
              readOnly
            />
          </div>

          <div>
            <Label htmlFor="foodFees" className="text-sm font-semibold text-foreground text-gray-700">
              Food Fees
            </Label>
            <Input
              id="foodFees"
              type="number"
              value={formData.foodFees}
              onChange={(e) => handleChange("foodFees", e.target.value)}
              placeholder="0.00"
              className="mt-2 h-12 border-2 focus:border-primary transition-all duration-300"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <Label htmlFor="rice" className="text-sm font-medium text-muted-foreground text-gray-700">
              Rice
            </Label>
            <Input
              id="rice"
              type="number"
              value={formData.rice}
              onChange={(e) => handleChange("rice", e.target.value)}
              placeholder="0.00"
              className="mt-2 h-12 border-2 focus:border-primary transition-all duration-300"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <Label htmlFor="gargentFees" className="text-sm font-semibold text-foreground text-gray-700">
              Gargent Fees
            </Label>
            <Input
              id="gargentFees"
              type="number"
              value={formData.gargentFees}
              onChange={(e) => handleChange("gargentFees", e.target.value)}
              placeholder="0.00"
              className="mt-2 h-12 border-2 focus:border-primary transition-all duration-300"
              min="0"
              step="0.01"
            />
          </div>

          <div className="lg:col-span-3 pt-4">
            <Button 
              type="submit" 
              className="w-full h-14 bg-gradient-to-r from-primary via-primary-glow to-admin-primary hover:opacity-90 transition-all duration-300 text-white font-semibold text-lg shadow-[var(--shadow-glow)]"
              disabled={!formData.studentName.trim() || !formData.beltLevel}
            >
              <Plus className="w-5 h-5 mr-2" />
              Register Student
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};