'use client'
import Search from '@/component/search';
import React, { useState } from 'react';
import { Card, Title, Text, Button, Select, MultiSelect, MultiSelectItem, NumberInput } from '@tremor/react';
import { useRouter } from 'next/navigation'
import exams from '../../mock/exams.json'
import periods from '../../mock/period.json'
import rooms from '../../mock/rooms.json'
import students from '../../mock/student.json'
import instructors from '../../mock/instructors.json'
import params from '../../mock/params.json'

interface ICardInfo {
  id: number;
  created_at: string;
  status: 'Success' | 'Pending' | 'Failed';
}

interface IExamInfo {
  id: string;
  length: string;
  alt: string;
  printOffset: string;
  average: string;
  period: { id: string; }[];
  room: { id: string; }[];
}

interface IPeriodInfo {
  id: string;
  length: string;
  day: string;
  time: string;
  penalty: string;
}

interface IParams {
  parameters: {
    property: Array<{
      name: string;
      value: string;
    }>;
  };
}

interface IPeriods {
  periods: {
    period: IPeriodInfo[];
  };
}

interface IExamData {
  examtt: {
    parameters: IParams['parameters'];
    periods: IPeriods['periods'];
  };
}

interface ICompleteDataStructure {
  examtt: {
    parameters: any;
    periods: any;
    rooms: any;
    exams: any;
    students: any;
    instructors: any;
    version: string;
    created: string;
  };
}

const statusStyles: { [key in ICardInfo['status']]: string } = {
  Success: 'bg-green-500',
  Pending: 'bg-yellow-500',
  Failed: 'bg-red-500',
};

const StatusIcon = ({ status }: { status: ICardInfo['status'] }) => {
  const style = statusStyles[status];
  return <span className={`inline-block w-3 h-3 rounded-full ${style} mr-2`}></span>;
};


export default function ResultPage() {
  const router = useRouter();
  const newdate = new Date();
  const [selectedPeriods, setSelectedPeriods] = useState<{ [examId: string]: string[] }>({});

  const [allDataState, setAllDataState] = useState<ICompleteDataStructure>({
    examtt: {
      parameters: params.parameters,
      periods: periods.periods,
      rooms: rooms.rooms,
      exams: exams.exams,
      students: students.students,
      instructors: instructors.instructors,
      version: "1.0", // Replace with the correct version if available
      created: newdate.toISOString(), // Replace with the correct creation date if available
    },
  });

  const [modifiableExams, setModifiableExams] = useState(allDataState.examtt.exams.exam);

  // Function to handle changes to exam averages
  const handleAverageChange = (examId: any, newAverage: any) => {
    setModifiableExams((currentExams: any[]) =>
      currentExams.map((exam: { id: any; }) =>
        exam.id === examId ? { ...exam, average: newAverage } : exam
      )
    );
  };

  const handlePeriodChange = (examId: string, selectedPeriodIds: any[]) => {
    setSelectedPeriods((prevSelectedPeriods) => ({
      ...prevSelectedPeriods,
      [examId]: selectedPeriodIds,
    }));
  };

  const updatePeriodsForExam = (examId: any, selectedPeriodIds: any[]) => {
    const updatedExams = allDataState.examtt.exams.exam.map((exam: { id: any; }) => {
      if (exam.id === examId) {
        return {
          ...exam,
          period: selectedPeriodIds.map((id: any) => ({ id })),
        };
      }
      return exam;
    });
  
    setAllDataState((prevState) => ({
      ...prevState,
      examtt: {
        ...prevState.examtt,
        exams: {
          ...prevState.examtt.exams,
          exam: updatedExams,
        },
      },
    }));
  };

  const handleDownloadJson = () => {
    const updatedAllDataState = {
      ...allDataState,
      examtt: {
        ...allDataState.examtt,
        exams: {
          ...allDataState.examtt.exams,
          exam: modifiableExams,
        },
      },
    };
  
    for (const examId in selectedPeriods) {
      if (selectedPeriods.hasOwnProperty(examId)) {
        const selectedPeriodIds = selectedPeriods[examId];
        updatedAllDataState.examtt.exams.exam = updatedAllDataState.examtt.exams.exam.map((exam: { id: any; }) => {
          if (exam.id === examId) {
            return {
              ...exam,
              period: selectedPeriodIds.map((id: any) => ({ id })),
            };
          }
          return exam;
        });
      }
    }
  
    // 3. Convert the updated data to a JSON blob
    const jsonData = JSON.stringify(updatedAllDataState, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
  
    // 4. Create a link and trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'updated_examtt_data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-4">
        <Title className='mr-auto'>Exam List</Title>
        <div className="flex items-center">
          <Button className="mr-2" onClick={handleDownloadJson}>Download JSON</Button>
          <Button className='green-button'>Upload to process</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
        {modifiableExams.map((examData: IExamInfo) => (
          <Card key={examData.id} className="mb-2 p-4">
            <Text className="text-lg font-semibold mb-2">Exam ID: {examData.id}</Text>
            <Text className="mb-1">Average student per room:</Text>
            <div className="text-lg font-semibold mb-2">
              <NumberInput
                id={`average-${examData.id}`}
                value={examData.average}
                onChange={(e) => handleAverageChange(examData.id, e.target.value)}
                className="mt-1 block w-full"
                enableStepper={false}
              />
            </div>
            <div>
              <Text className="mb-1">Select Period:</Text>
              <MultiSelect
                value={selectedPeriods[examData.id] || []}
                onChange={(selectedItems: any) => handlePeriodChange(examData.id, selectedItems)}
                placeholder="Select Periods"
              >
                {periods.periods.period.map((period: IPeriodInfo) => (
                  <MultiSelectItem key={period.id} value={period.id}>
                    {`${period.day} ${period.time}`}
                  </MultiSelectItem>
                ))}
              </MultiSelect>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}