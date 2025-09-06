import { useMemo } from "react";
import { FloatingNavbar } from "@/components/FloatingNavbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Student, BELT_LEVELS } from "@/types/student";
import { useLocation } from "react-router-dom";

const Analytics = () => {
  const location = useLocation();
  const students = (location.state?.students as Student[]) || [];

  const analyticsData = useMemo(() => {
    const beltStats = BELT_LEVELS.map(belt => {
      const beltStudents = students.filter(student => student.beltLevel.id === belt.id);
      const totalFees = beltStudents.reduce((sum, student) => 
        sum + student.examFees + student.foodFees + (student.rice || 0) + student.garmentFees, 0);
      
      return {
        name: `${belt.name} ${belt.kyu}`,
        students: beltStudents.length,
        totalFees,
        examFees: beltStudents.reduce((sum, student) => sum + student.examFees, 0),
        foodFees: beltStudents.reduce((sum, student) => sum + student.foodFees, 0),
        rice: beltStudents.reduce((sum, student) => sum + (student.rice || 0), 0),
        garmentFees: beltStudents.reduce((sum, student) => sum + student.garmentFees, 0),
        color: belt.color
      };
    });

    return beltStats.filter(stat => stat.students > 0);
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
    garmentFees: {
      label: "Garment Fees",
      color: "hsl(var(--chart-5))"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <FloatingNavbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl pt-20">
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
              <CardTitle>Student Distribution by Belt Level</CardTitle>
              <CardDescription>Number of students per belt level</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="students" fill="var(--color-students)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Fee Distribution */}
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Total Fees by Belt</CardTitle>
                <CardDescription>Revenue distribution across belt levels</CardDescription>
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
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="totalFees"
                      >
                        {analyticsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Fee Breakdown by Type</CardTitle>
                <CardDescription>Detailed fee analysis per belt level</CardDescription>
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
                      <Bar dataKey="garmentFees" stackId="a" fill="var(--color-garmentFees)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Summary Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{students.length}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{analyticsData.reduce((sum, belt) => sum + belt.totalFees, 0)}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Active Belts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.length}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Avg Fee per Student</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{students.length > 0 ? Math.round(analyticsData.reduce((sum, belt) => sum + belt.totalFees, 0) / students.length) : 0}
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