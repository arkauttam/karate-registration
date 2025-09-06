import { useEffect, useMemo, useState } from "react";
import { FloatingNavbar } from "@/components/FloatingNavbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Student, BELT_LEVELS } from "@/types/student";

const Analytics = () => {
  const [students, setStudents] = useState<Student[]>([]);
  useEffect(() => {
    const savedStudents = localStorage.getItem("students");
    if (savedStudents) setStudents(JSON.parse(savedStudents));
  }, []);

  const analyticsData = useMemo(() => {
    return BELT_LEVELS.map(belt => {
      const beltStudents = students.filter(s => s.beltLevel.id === belt.id);
      const examFees = beltStudents.reduce((sum, s) => sum + s.examFees, 0);
      const foodFees = beltStudents.reduce((sum, s) => sum + s.foodFees, 0);
      const rice = beltStudents.reduce((sum, s) => sum + (s.rice || 0), 0);
      const gargentFees = beltStudents.reduce((sum, s) => sum + s.gargentFees, 0);
      const totalFees = examFees + foodFees + rice + gargentFees;
      const othersFees = totalFees - examFees;
      return { name: `${belt.name} ${belt.kyu}`, students: beltStudents.length, totalFees, examFees, othersFees, foodFees, rice, gargentFees, color: belt.color };
    }).filter(stat => stat.students > 0);
  }, [students]);

  const chartConfig = {
    students: { label: "Students", color: "hsl(var(--chart-1))" },
    totalFees: { label: "Total Fees", color: "hsl(var(--chart-2))" },
    examFees: { label: "Exam Fees", color: "hsl(var(--chart-3))" },
    foodFees: { label: "Food Fees", color: "hsl(var(--chart-4))" },
    gargentFees: { label: "Gargent Fees", color: "hsl(var(--chart-5))" }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <FloatingNavbar />

      <div className="container mx-auto px-4 py-8 max-w-7xl pt-20 my-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-admin-primary bg-clip-text text-transparent mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-xl mx-auto">
            Belt-wise student analytics and fee distribution insights
          </p>
        </div>

        <div className="grid gap-6">
          {/* Student Distribution by Belt */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-gray-600 text-sm sm:text-base">Student Distribution by Belt Level</CardTitle>
              <CardDescription className="text-gray-500 text-xs sm:text-sm">Number of students per belt level</CardDescription>
            </CardHeader>
            <CardContent className="px-1 sm:px-4">
              <ChartContainer config={chartConfig} className="h-[250px] sm:h-[350px]">
                <ResponsiveContainer width="10%" height="100%">
                  <BarChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-30} textAnchor="end" height={50} />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="students">
                      {analyticsData.map((entry, index) => (
                        <Cell key={index} fill={beltColorMap[entry.color] || "#8884d8"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Fee Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Total Fees Pie */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-gray-700 text-sm sm:text-base">Total Fees by Belt</CardTitle>
                <CardDescription className="text-gray-600 text-xs sm:text-sm">Revenue distribution across belt levels</CardDescription>
              </CardHeader>
              <CardContent className="px-2 sm:px-4">
                <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={70}
                        dataKey="totalFees"
                      >
                        {analyticsData.map((entry, index) => (
                          <Cell key={index} fill={beltColorMap[entry.color] || "#8884d8"} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Fee Breakdown */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-gray-700 text-sm sm:text-base">Fee Breakdown by Type</CardTitle>
                <CardDescription className="text-gray-600 text-xs sm:text-sm">Detailed fee analysis per belt level</CardDescription>
              </CardHeader>
              <CardContent className="px-2 sm:px-4">
                <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-30} textAnchor="end" height={50} />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Total Students", value: students.length },
              { title: "Total Revenue", value: `₹${analyticsData.reduce((sum, b) => sum + b.totalFees, 0)}` },
              { title: "Others Fee", value: `₹${analyticsData.reduce((sum, b) => sum + b.othersFees, 0)}` },
              { title: "Total Exam Fee", value: `₹${analyticsData.reduce((sum, b) => sum + b.examFees, 0)}` },
            ].map((stat) => (
              <Card key={stat.title} className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">{stat.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Analytics;
