import { useState, useMemo } from "react";
import { FloatingNavbar } from "@/components/FloatingNavbar";
import { Footer } from "@/components/Footer";
import { StudentsTable } from "@/components/StudentsTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Student, BELT_LEVELS } from "@/types/student";
import { useLocation } from "react-router-dom";
import { Medal, Users, DollarSign } from "lucide-react";

const Belts = () => {
  const location = useLocation();
  const students = (location.state?.students as Student[]) || [];
  const [selectedBeltFilter, setSelectedBeltFilter] = useState<string>("all");

  const filteredStudents = useMemo(() => {
    if (selectedBeltFilter === "all") return students;
    return students.filter(student => student.beltLevel.id === selectedBeltFilter);
  }, [students, selectedBeltFilter]);

  const beltStatistics = useMemo(() => {
    return BELT_LEVELS.map(belt => {
      const beltStudents = students.filter(student => student.beltLevel.id === belt.id);
      const totalRevenue = beltStudents.reduce((sum, student) => 
        sum + student.examFees + student.foodFees + (student.rice || 0) + student.garmentFees, 0);
      
      return {
        ...belt,
        studentCount: beltStudents.length,
        totalRevenue,
        avgRevenue: beltStudents.length > 0 ? Math.round(totalRevenue / beltStudents.length) : 0
      };
    }).filter(belt => belt.studentCount > 0);
  }, [students]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <FloatingNavbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl pt-20">
        <div className="mb-12 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-admin-primary bg-clip-text text-transparent mb-4">
            Belt Management
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive belt-wise student management and statistics
          </p>
        </div>

        <div className="space-y-10">
          {/* Belt Statistics Cards */}
          <div className="grid gap-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Belt Statistics</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {beltStatistics.map((belt) => (
                <Card key={belt.id} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full ${belt.color} border-2`}></div>
                        <div>
                          <CardTitle className="text-lg">{belt.name} {belt.kyu}</CardTitle>
                          <CardDescription>Base fee: ₹{belt.fee}</CardDescription>
                        </div>
                      </div>
                      <Medal className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Students</span>
                      </div>
                      <Badge variant="secondary">{belt.studentCount}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Total Revenue</span>
                      </div>
                      <span className="font-semibold">₹{belt.totalRevenue}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Avg per Student</span>
                      </div>
                      <span className="font-semibold">₹{belt.avgRevenue}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Belt Filter */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Medal className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Filter by Belt:</span>
            </div>
            <Select value={selectedBeltFilter} onValueChange={setSelectedBeltFilter}>
              <SelectTrigger className="w-64 h-12 border-2 focus:border-primary">
                <SelectValue placeholder="Select belt level" />
              </SelectTrigger>
              <SelectContent className="bg-card/95 backdrop-blur-lg border-border">
                <SelectItem value="all">All Belt Levels</SelectItem>
                {BELT_LEVELS.map((belt) => (
                  <SelectItem key={belt.id} value={belt.id}>
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${belt.color} border-2`}></div>
                      <span className="font-medium">{belt.name} {belt.kyu}</span>
                      <span className="text-sm text-muted-foreground">₹{belt.fee}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Students Table */}
          <StudentsTable students={filteredStudents} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Belts;