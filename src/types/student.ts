export interface BeltLevel {
  id: string;
  name: string;
  kyu: string;
  fee: number;
  color: string;
}

export interface Student {
  id: string;
  slNo: number;
  studentName: string;
  beltLevel: BeltLevel;
  examFees: number;
  foodFees: number;
  rice?: number;
  garmentFees: number;
  createdAt: Date;
}

export interface StudentFormData {
  studentName: string;
  beltLevel: string;
  examFees: string;
  foodFees: string;
  rice?: string;
  garmentFees: string;
}

export interface StudentSummary {
  totalStudents: number;
  totalExamFees: number;
  totalFoodFees: number;
  totalRice: number;
  totalGarmentFees: number;
  grandTotal: number;
}

export const BELT_LEVELS: BeltLevel[] = [
  { id: 'white-10', name: 'White', kyu: '10th kyu', fee: 170, color: 'bg-white text-black border-gray-300' },
  { id: 'white-9', name: 'White', kyu: '9th kyu', fee: 170, color: 'bg-white text-black border-gray-300' },
  { id: 'blue-8', name: 'Blue', kyu: '8th kyu', fee: 170, color: 'bg-blue-500 text-white' },
  { id: 'blue-7', name: 'Blue', kyu: '7th kyu', fee: 200, color: 'bg-blue-600 text-white' },
  { id: 'yellow-6', name: 'Yellow', kyu: '6th kyu', fee: 200, color: 'bg-yellow-400 text-black' },
  { id: 'yellow-5', name: 'Yellow', kyu: '5th kyu', fee: 230, color: 'bg-yellow-500 text-black' },
  { id: 'green-4', name: 'Green', kyu: '4th kyu', fee: 230, color: 'bg-green-500 text-white' },
  { id: 'green-3', name: 'Green', kyu: '3rd kyu', fee: 260, color: 'bg-green-600 text-white' },
  { id: 'brown-2', name: 'Brown', kyu: '2nd kyu', fee: 300, color: 'bg-amber-700 text-white' },
  { id: 'brown-1', name: 'Brown', kyu: '1st kyu', fee: 300, color: 'bg-amber-800 text-white' },
];