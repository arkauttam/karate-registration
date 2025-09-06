import { useState, useMemo } from "react";
import { FloatingNavbar } from "@/components/FloatingNavbar";
import { Footer } from "@/components/Footer";
import { StudentsTable } from "@/components/StudentsTable";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Student, BELT_LEVELS } from "@/types/student";
import { useLocation } from "react-router-dom";
import { Search, Users, GraduationCap, DollarSign, Medal } from "lucide-react";

const Students = () => {
  const location = useLocation();
  const students = (location.state?.students as Student[]) || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBeltFilter, setSelectedBeltFilter] = useState<string>("all");
  const [feeRangeFilter, setFeeRangeFilter] = useState<string>("all");

  const filteredStudents = useMemo(() => {
    let filtered = students;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.slNo.toString().includes(searchTerm) ||
        student.beltLevel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.beltLevel.kyu.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Belt filter
    if (selectedBeltFilter !== "all") {
      filtered = filtered.filter(student => student.beltLevel.id === selectedBeltFilter);
    }

    // Fee range filter
    if (feeRangeFilter !== "all") {
      filtered = filtered.filter(student => {
        const totalFees = student.examFees + student.foodFees + (student.rice || 0) + student.garmentFees;
        switch (feeRangeFilter) {
          case "low": return totalFees < 500;
          case "medium": return totalFees >= 500 && totalFees < 1000;
          case "high": return totalFees >= 1000;
          default: return true;
        }
      });
    }

    return filtered;
  }, [students, searchTerm, selectedBeltFilter, feeRangeFilter]);

  const studentStats = useMemo(() => {
    const totalFees = students.reduce((sum, student) => 
      sum + student.examFees + student.foodFees + (student.rice || 0) + student.garmentFees, 0);
    
    const avgFees = students.length > 0 ? Math.round(totalFees / students.length) : 0;
    
    const beltDistribution = BELT_LEVELS.map(belt => ({
      ...belt,
      count: students.filter(student => student.beltLevel.id === belt.id).length
    })).filter(belt => belt.count > 0);

    return {
      totalStudents: students.length,
      totalFees,
      avgFees,
      activeBelts: beltDistribution.length,
      beltDistribution
    };
  }, [students]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <FloatingNavbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl pt-20">
        <div className="mb-12 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-admin-primary bg-clip-text text-transparent mb-4">
            Student Management
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive student directory with advanced filtering and analytics
          </p>
        </div>

        <div className="space-y-10">
          {/* Student Statistics */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{studentStats.totalStudents}</div>
                <p className="text-xs text-muted-foreground mt-1">Registered students</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{studentStats.totalFees}</div>
                <p className="text-xs text-muted-foreground mt-1">All fees combined</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-500" />
                  <CardTitle className="text-sm font-medium">Average Fee</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{studentStats.avgFees}</div>
                <p className="text-xs text-muted-foreground mt-1">Per student</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Medal className="w-5 h-5 text-yellow-500" />
                  <CardTitle className="text-sm font-medium">Active Belts</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{studentStats.activeBelts}</div>
                <p className="text-xs text-muted-foreground mt-1">Belt levels in use</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Search & Filter Students</CardTitle>
              <CardDescription>Find students by name, serial number, or belt level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, serial number, or belt..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>

                {/* Belt Filter */}
                <Select value={selectedBeltFilter} onValueChange={setSelectedBeltFilter}>
                  <SelectTrigger className="w-full md:w-64 h-12">
                    <SelectValue placeholder="Filter by belt" />
                  </SelectTrigger>
                  <SelectContent className="bg-card/95 backdrop-blur-lg border-border">
                    <SelectItem value="all">All Belts</SelectItem>
                    {BELT_LEVELS.map((belt) => (
                      <SelectItem key={belt.id} value={belt.id}>
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${belt.color} border-2`}></div>
                          <span>{belt.name} {belt.kyu}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Fee Range Filter */}
                <Select value={feeRangeFilter} onValueChange={setFeeRangeFilter}>
                  <SelectTrigger className="w-full md:w-48 h-12">
                    <SelectValue placeholder="Fee range" />
                  </SelectTrigger>
                  <SelectContent className="bg-card/95 backdrop-blur-lg border-border">
                    <SelectItem value="all">All Ranges</SelectItem>
                    <SelectItem value="low">Low (&lt; ₹500)</SelectItem>
                    <SelectItem value="medium">Medium (₹500-999)</SelectItem>
                    <SelectItem value="high">High (₹1000+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                Showing {filteredStudents.length} of {students.length} students
              </div>
            </CardContent>
          </Card>

          {/* Students Table */}
          <StudentsTable students={filteredStudents} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Students;