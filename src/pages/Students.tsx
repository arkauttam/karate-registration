import { useState, useMemo, useEffect } from "react";
import { FloatingNavbar } from "@/components/FloatingNavbar";
import { Footer } from "@/components/Footer";
import { StudentsTable } from "@/components/StudentsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Student, BELT_LEVELS } from "@/types/student";
import { Users, GraduationCap, Medal, IndianRupee } from "lucide-react";

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  useEffect(() => {
    const savedStudents = localStorage.getItem("students");
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
  }, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBeltFilter, setSelectedBeltFilter] = useState<string>("all");
  const [feeRangeFilter, setFeeRangeFilter] = useState<string>("all");

  const filteredStudents = useMemo(() => {
    let filtered = students;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((student) =>
        student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.slNo.toString().includes(searchTerm) ||
        student.beltLevel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.beltLevel.kyu.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Belt filter
    if (selectedBeltFilter !== "all") {
      filtered = filtered.filter((student) => student.beltLevel.id === selectedBeltFilter);
    }

    // Fee range filter
    if (feeRangeFilter !== "all") {
      filtered = filtered.filter((student) => {
        const totalFees = student.examFees + student.foodFees + (student.rice || 0) + student.gargentFees;
        switch (feeRangeFilter) {
          case "low":
            return totalFees < 500;
          case "medium":
            return totalFees >= 500 && totalFees < 1000;
          case "high":
            return totalFees >= 1000;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [students, searchTerm, selectedBeltFilter, feeRangeFilter]);

  const studentStats = useMemo(() => {
    const totalFees = students.reduce(
      (sum, student) =>
        sum + student.examFees + student.foodFees + (student.rice || 0) + student.gargentFees,
      0
    );


    const totalExamFees = students.reduce((sum, student) => sum + student.examFees, 0);
    const othersFees = (totalFees-totalExamFees)

    return {
      totalStudents: students.length,
      totalFees,
      othersFees,
      totalExamFees,
    };
  }, [students]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <FloatingNavbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl pt-20 my-16">
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
                <div className="text-2xl font-bold text-primary">{studentStats.totalStudents}</div>
                <p className="text-xs text-muted-foreground mt-1">Registered students</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-green-500" />
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">₹{studentStats.totalFees}</div>
                <p className="text-xs text-muted-foreground mt-1">All fees combined</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-blue-500" />
                  <CardTitle className="text-sm font-medium">Others Fee</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">₹{studentStats.othersFees}</div>
                <p className="text-xs text-muted-foreground mt-1">Collected  fees</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Medal className="w-5 h-5 text-yellow-500" />
                  <CardTitle className="text-sm font-medium">Total Exam Fee</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">₹{studentStats.totalExamFees}</div>
                <p className="text-xs text-muted-foreground mt-1">Collected exam fees</p>
              </CardContent>
            </Card>
          </div>

          {/* Students Table */}
          <StudentsTable students={filteredStudents} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Students;
