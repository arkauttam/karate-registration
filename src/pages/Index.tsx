import { useState, useMemo, useEffect } from "react";
import { StudentForm } from "@/components/StudentForm";
import { StudentsTable } from "@/components/StudentsTable";
import { SummaryCards } from "@/components/SummaryCards";
import { FloatingNavbar } from "@/components/FloatingNavbar";
import { Footer } from "@/components/Footer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Student, StudentFormData, StudentSummary, BELT_LEVELS } from "@/types/student";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Award } from "lucide-react";

const Index = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedBeltFilter, setSelectedBeltFilter] = useState<string>("all");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const savedStudents = localStorage.getItem("students");
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  const handleAddStudent = (formData: StudentFormData) => {
    const selectedBelt = BELT_LEVELS.find(belt => belt.id === formData.beltLevel);
    if (!selectedBelt) return;

    const newStudent: Student = {
      id: crypto.randomUUID(),
      slNo: students.length + 1,
      studentName: formData.studentName,
      beltLevel: selectedBelt,
      examFees: parseFloat(formData.examFees) || 0,
      foodFees: parseFloat(formData.foodFees) || 0,
      rice: formData.rice ? parseFloat(formData.rice) : undefined,
      gargentFees: parseFloat(formData.gargentFees) || 0,
      createdAt: new Date(),
    };

    setStudents(prev => [...prev, newStudent]);

    toast({
      title: "Student Registered Successfully",
      description: `${newStudent.studentName} (${selectedBelt.name} ${selectedBelt.kyu}) has been registered.`,
    });
  };

  const filteredStudents = useMemo(() => {
    if (selectedBeltFilter === "all") return students;
    return students.filter(student => student.beltLevel.id === selectedBeltFilter);
  }, [students, selectedBeltFilter]);

  const summary: StudentSummary = useMemo(() => {
    return filteredStudents.reduce(
      (acc, student) => ({
        totalStudents: acc.totalStudents + 1,
        totalExamFees: acc.totalExamFees + student.examFees,
        totalFoodFees: acc.totalFoodFees + student.foodFees,
        totalRice: acc.totalRice + (student.rice || 0),
        totalGargentFees: acc.totalGargentFees + student.gargentFees,
        grandTotal: acc.grandTotal + student.examFees + student.foodFees + (student.rice || 0) + student.gargentFees,
      }),
      {
        totalStudents: 0,
        totalExamFees: 0,
        totalFoodFees: 0,
        totalRice: 0,
        totalGargentFees: 0,
        grandTotal: 0,
      }
    );
  }, [filteredStudents]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <FloatingNavbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl pt-20 my-16">
        <div className="mb-12 text-center bg-indian-flag rounded-2xl p-4 opacity-80">
          <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
            Karate Academy Portal
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-gray-700 font-semibold">
            Advanced student registration system with belt level management and comprehensive fee tracking
          </p>
        </div>

        <div className="space-y-10">
          {/* Belt Filter for Summary */}
          <div className="flex items-center justify-start gap-4 mb-6">
            <Select value={selectedBeltFilter} onValueChange={setSelectedBeltFilter}>
              <SelectTrigger className="w-64 h-12 border-2 rounded-lg">
                <SelectValue placeholder="Select belt level" />
              </SelectTrigger>

              <SelectContent className="bg-card/95 backdrop-blur-lg border-border">
                <SelectItem value="all" className="text-gray-700">All Belt Levels</SelectItem>
                {BELT_LEVELS.map((belt) => (
                  <SelectItem key={belt.id} value={belt.id}>
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${belt.color} border-2`}></div>
                      <span className="font-medium text-gray-700">
                        {belt.name} {belt.kyu}
                      </span>
                      <span className="text-sm text-muted-foreground">₹{belt.fee}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <SummaryCards summary={summary} />
          <StudentForm onSubmit={handleAddStudent} />
          <StudentsTable students={students} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
