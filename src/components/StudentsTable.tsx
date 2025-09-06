import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Student, BELT_LEVELS } from "@/types/student";
import { Search, Users, Award, TrendingUp, SlidersHorizontal } from "lucide-react";

interface StudentsTableProps {
  students: Student[];
}

export const StudentsTable = ({ students }: StudentsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState<"all" | "high-fees" | "low-fees">("all");
  const [beltFilter, setBeltFilter] = useState<string>("all");

  const filteredStudents = useMemo(() => {
    let filtered = students.filter(student =>
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.slNo.toString().includes(searchTerm) ||
      student.beltLevel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.beltLevel.kyu.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterBy === "high-fees") {
      filtered = filtered.filter(student => {
        const total = student.examFees + student.foodFees + (student.rice || 0) + student.garmentFees;
        return total > 1000;
      });
    } else if (filterBy === "low-fees") {
      filtered = filtered.filter(student => {
        const total = student.examFees + student.foodFees + (student.rice || 0) + student.garmentFees;
        return total <= 1000;
      });
    }

    if (beltFilter !== "all") {
      filtered = filtered.filter(student => student.beltLevel.id === beltFilter);
    }

    return filtered.sort((a, b) => b.slNo - a.slNo);
  }, [students, searchTerm, filterBy, beltFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateTotal = (student: Student) => {
    return student.examFees + student.foodFees + (student.rice || 0) + student.garmentFees;
  };

  const getBeltBadgeColor = (beltName: string) => {
    switch (beltName) {
      case "White": return "bg-gray-100 text-gray-800 border-gray-300";
      case "Blue": return "bg-blue-100 text-blue-800 border-blue-300";
      case "Yellow": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Green": return "bg-green-100 text-green-800 border-green-300";
      case "Brown": return "bg-amber-100 text-amber-800 border-amber-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <Card className="shadow-[var(--shadow-elegant)] border-border/50 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-admin-secondary via-muted to-admin-secondary/50">
        <CardTitle className="flex items-center gap-3 text-foreground">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              Registered Students 
              <Badge variant="secondary" className="px-3 py-1 font-semibold">
                {filteredStudents.length}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground font-normal mt-1">
              Total of {students.length} students registered
            </p>
          </div>
        </CardTitle>
        
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, serial number, or belt level..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 border-2 focus:border-primary transition-all duration-300 bg-background/50"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
            
            <Select value={beltFilter} onValueChange={setBeltFilter}>
              <SelectTrigger className="w-48 h-10">
                <SelectValue placeholder="Filter by belt" />
              </SelectTrigger>
              <SelectContent className="bg-card/95 backdrop-blur-lg border-border">
                <SelectItem value="all">All Belt Levels</SelectItem>
                {BELT_LEVELS.map((belt) => (
                  <SelectItem key={belt.id} value={belt.id}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${belt.color} border`}></div>
                      <span>{belt.name} {belt.kyu}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              <Button
                variant={filterBy === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterBy("all")}
                className="h-10"
              >
                All Students
              </Button>
              <Button
                variant={filterBy === "high-fees" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterBy("high-fees")}
                className="h-10"
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                High Fees
              </Button>
              <Button
                variant={filterBy === "low-fees" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterBy("low-fees")}
                className="h-10"
              >
                Low Fees
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {students.length === 0 ? "No Students Registered" : "No Matching Results"}
            </h3>
            <p className="text-muted-foreground">
              {students.length === 0 
                ? "Start by registering your first student above." 
                : "Try adjusting your search or filter criteria."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/40">
                  <TableHead className="w-20 font-semibold">Sl No</TableHead>
                  <TableHead className="font-semibold">Student Name</TableHead>
                  <TableHead className="font-semibold">Belt Level</TableHead>
                  <TableHead className="text-right font-semibold">Exam Fees</TableHead>
                  <TableHead className="text-right font-semibold">Food Fees</TableHead>
                  <TableHead className="text-right font-semibold">Rice</TableHead>
                  <TableHead className="text-right font-semibold">Garment Fees</TableHead>
                  <TableHead className="text-right font-bold text-primary">Total Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student, index) => (
                  <TableRow 
                    key={student.id} 
                    className={`hover:bg-muted/20 transition-all duration-300 border-b border-border/50 ${
                      index % 2 === 0 ? "bg-background" : "bg-muted/5"
                    }`}
                  >
                    <TableCell className="font-bold text-primary">
                      #{student.slNo}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {student.studentName}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`${getBeltBadgeColor(student.beltLevel.name)} font-medium`}
                      >
                        <Award className="w-3 h-3 mr-1" />
                        {student.beltLevel.name} {student.beltLevel.kyu}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(student.examFees)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(student.foodFees)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-muted-foreground">
                      {student.rice ? formatCurrency(student.rice) : '—'}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(student.garmentFees)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary text-lg">
                      {formatCurrency(calculateTotal(student))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};