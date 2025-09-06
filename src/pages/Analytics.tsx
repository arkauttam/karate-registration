import { useEffect, useMemo, useState } from "react";
import { FloatingNavbar } from "@/components/FloatingNavbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Student, BELT_LEVELS } from "@/types/student";

const Analytics = () => {
  const [students, setStudents] = useState<Student[]>([]);
  useEffect(() => {
    const savedStudents = localStorage.getItem("students");
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
  }, []);

  const analyticsData = useMemo(() => {
    const beltStats = BELT_LEVELS.map((belt) => {
      const beltStudents = students.filter(
        (student) => student.beltLevel.id === belt.id
      );

      const examFees = beltStudents.reduce(
        (sum, student) => sum + student.examFees,
        0
      );
      const foodFees = beltStudents.reduce(
        (sum, student) => sum + student.foodFees,
        0
      );
      const rice = beltStudents.reduce(
        (sum, student) => sum + (student.rice || 0),
        0
      );
      const gargentFees = beltStudents.reduce(
        (sum, student) => sum + student.gargentFees,
        0
      );

      const totalFees = examFees + foodFees + rice + gargentFees;
      const othersFees = totalFees - examFees;

      return {
        name: `${belt.name} ${belt.kyu}`,
        students: beltStudents.length,
        totalFees,
        examFees,
        othersFees,
        foodFees,
        rice,
        gargentFees,
        color: belt.color,
      };
    });

    // Only return belts that actually have students
    return beltStats.filter((stat) => stat.students > 0);
  }, [students]);


  const chartConfig = {
    students: {
      label: "Students",
      color: "hsl(var(--chart-1))"
    },
    totalFees: {
      label: "Total Fees",
      color: "hsl(var(--chart-2))"
    },
    examFees: {
      label: "Exam Fees",
      color: "hsl(var(--chart-3))"
    },
    foodFees: {
      label: "Food Fees",
      color: "hsl(var(--chart-4))"
    },
    gargentFees: {
      label: "Gargent Fees",
      color: "hsl(var(--chart-5))"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <FloatingNavbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl pt-20 my-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-admin-primary bg-clip-text text-transparent mb-4">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Belt-wise student analytics and fee distribution insights
          </p>
        </div>

        <div className="grid gap-8">
          {/* Student Distribution by Belt */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-gray-600">Student Distribution by Belt Level</CardTitle>
              <CardDescription className="text-gray-500">Number of students per belt level</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="students">
                      {analyticsData.map((entry, index) => {
                        // Map Tailwind colors to hex for recharts
                        const beltColorMap: Record<string, string> = {
                          "bg-white text-black border-gray-300": "#eeeeee",
                          "bg-blue-500 text-white": "#3b82f6",
                          "bg-blue-600 text-white": "#2563eb",
                          "bg-yellow-400 text-black": "#facc15",
                          "bg-yellow-500 text-black": "#eab308",
                          "bg-green-500 text-white": "#22c55e",
                          "bg-green-600 text-white": "#16a34a",
                          "bg-amber-700 text-white": "#b45309",
                          "bg-amber-800 text-white": "#92400e",
                        };

                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={beltColorMap[entry.color] || "#8884d8"} // fallback
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>


          {/* Fee Distribution */}
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-gray-700">Total Fees by Belt</CardTitle>
                <CardDescription className="text-gray-600">Revenue distribution across belt levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        dataKey="totalFees"
                      >
                        {analyticsData.map((entry, index) => {
                          // Same Tailwind → HEX mapping
                          const beltColorMap: Record<string, string> = {
                            "bg-white text-black border-gray-300": "#eeeeee",
                            "bg-blue-500 text-white": "#3b82f6",
                            "bg-blue-600 text-white": "#2563eb",
                            "bg-yellow-400 text-black": "#facc15",
                            "bg-yellow-500 text-black": "#eab308",
                            "bg-green-500 text-white": "#22c55e",
                            "bg-green-600 text-white": "#16a34a",
                            "bg-amber-700 text-white": "#b45309",
                            "bg-amber-800 text-white": "#92400e",
                          };

                          return (
                            <Cell
                              key={`cell-${index}`}
                              fill={beltColorMap[entry.color] || "#8884d8"} // fallback
                            />
                          );
                        })}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>


            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-gray-700">Fee Breakdown by Type</CardTitle>
                <CardDescription className="text-gray-600">Detailed fee analysis per belt level</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="examFees" stackId="a" fill="var(--color-examFees)" />
                      <Bar dataKey="foodFees" stackId="a" fill="var(--color-foodFees)" />
                      <Bar dataKey="gargentFees" stackId="a" fill="var(--color-gargentFees)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Summary Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            {/* Total Students */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">Total Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{students.length}</div>
              </CardContent>
            </Card>

            {/* Total Revenue */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  ₹{analyticsData.reduce((sum, belt) => sum + belt.totalFees, 0)}
                </div>
              </CardContent>
            </Card>

            {/* Others Fee */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">Others Fee</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  ₹{analyticsData.reduce((sum, belt) => sum + belt.othersFees, 0)}
                </div>
              </CardContent>
            </Card>

            {/* Total Exam Fee */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">Total Exam Fee</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  ₹{analyticsData.reduce((sum, belt) => sum + belt.examFees, 0)}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Analytics;