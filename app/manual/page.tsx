'use client'
import Search from '@/component/search';
import React, { useEffect, useState } from 'react';
import { Card, Title, Text, Button, Select, MultiSelect, MultiSelectItem, NumberInput, TextInput, SelectItem, SearchSelect, SearchSelectItem, Badge } from '@tremor/react';
import { useRouter } from 'next/navigation'
import exams from '../../public/json/exams.json'
import periods from '../../public/json/period.json'
import rooms from '../../public/json/rooms.json'
import students from '../../public/json/student.json'
import instructors from '../../public/json/instructors.json'
import params from '../../public/json/params.json'
import departments from '../../public/json/department.json'
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon';

interface ICardInfo {
  id: number;
  created_at: string;
  status: 'Success' | 'Pending' | 'Failed';
}

interface IExamInfo {
  id: string;
  name: string; 
  departmentId: string;
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

interface IRoomInfo {
  id: string;
  size: string;
  alt: string;
  coordinates: string;
}

interface IParams {
  parameters: {
    property: Array<{
      name: string;
      value: string;
    }>;
  };
}

interface IRooms {
  rooms: {
    room: IRoomInfo[];
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

interface IDepartmentData {
  department: Array<{
    id: string;
    name: string;
    code: string;
  }>;
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

interface RootObject {
  instructors: Instructors;
}

interface Instructors {
  instructor: Instructor[];
}

interface Instructor {
  id: string;
  exam: Exam[];
}

interface Exam {
  id: string;
}

const departmentColorMapping: any = {
  '1': 'red',
  '2': 'green',
  '3': 'yellow',
};

const statusStyles: { [key in IExamInfo['departmentId']]: string } = {
  1: 'bg-red-500',
  2: 'bg-green-500',
  3: 'bg-yellow-500',
};

const StatusIcon = ({ departmentId }: { departmentId: IExamInfo['departmentId'] }) => {
  const style = statusStyles[departmentId];
  return <span className={`inline-block w-3 h-3 rounded-full ${style} mr-2`}></span>;
};


export default function ManualPage() {
  const router = useRouter();
  const newdate = new Date();

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

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');

  const [modifiableExams, setModifiableExams] = useState<any>(allDataState.examtt.exams.exam);

  const initialSelectedPeriods = exams.exams.exam.map((exam: IExamInfo) => ({
    [exam.id]: exam.period.map((p) => p.id),
  })).reduce((acc: any, val: any) => ({ ...acc, ...val }), {});

  const initialRooms = exams.exams.exam.map((exam: IExamInfo) => ({
    [exam.id]: exam.room.map((p) => p.id),
  })).reduce((acc: any, val: any) => ({ ...acc, ...val }), {});

  const initialInstructors = instructors.instructors.instructor.map((instructor: Instructor) => ({
    instructor,
  })).reduce((acc: any, val: any) => ({ ...acc, ...val }), {});

  const [selectedPeriods, setSelectedPeriods] = useState<{ [examId: string]: string[] }>(
    initialSelectedPeriods
  );

  const [selectedRooms, setSelectedRooms] = useState<{ [roomId: string]: string[] }>(
    initialRooms
  );

  const [selectedInstructors, setSelectInsreuctors] = useState<{ [instructorId: string]: string[] }>(
    initialInstructors
  );

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

  const handleRoomChange = (examId: string, selectedRoomIds: any[]) => {
    setSelectedRooms((prevSelectedPeriods) => ({
      ...prevSelectedPeriods,
      [examId]: selectedRoomIds,
    }));
  };

  const handleInstructorChange = (instructorId: string, selectInstructorIds: any[]) => {
    setSelectInsreuctors((prevSelectedPeriods) => ({
      ...prevSelectedPeriods,
      [instructorId]: selectInstructorIds,
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

  const handleRemovePeriod = (examId: string, newSelectedPeriods: string[]) => {
    setSelectedPeriods(prevSelectedPeriods => ({
      ...prevSelectedPeriods,
      [examId]: newSelectedPeriods,
    }));
  };  

  const handleRemoveFilterExam = () => {
    setSelectedDepartmentId("")
  };  

  const handleRemoveRoom = (examId: string, newSelectedRooms: string[]) => {
    setSelectedRooms(prevSelectedRooms => ({
      ...prevSelectedRooms,
      [examId]: newSelectedRooms,
    }));
  };  

  const handleRemoveInstructor = (examId: string, newSelectedInstructors: string[]) => {
    setSelectInsreuctors(prevSelectedInstructor => ({
      ...prevSelectedInstructor,
      [examId]: newSelectedInstructors,
    }));
  };  

  const handleDownloadJson = () => {
    
    const sanitizedExams = modifiableExams.map(({ name, departmentId, ...restOfExam }: IExamInfo) => restOfExam);

    const updatedAllDataState = {
      ...allDataState,
      examtt: {
        ...allDataState.examtt,
        exams: {
          ...allDataState.examtt.exams,
          exam: sanitizedExams,
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

  const filteredExams = modifiableExams.filter((exam: IExamInfo) =>
    exam.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Set the mounted state to true when the component mounts
    setIsMounted(true);
  }, []);


  useEffect(() => {
    console.log('%cpage.tsx line:246 object', 'color: #007acc;', selectedDepartmentId);
  },[selectedDepartmentId])

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-4">
        <Title className='mr-auto'>Exam List</Title>
        <div className="flex items-center">
          <Button className="mr-2" onClick={handleDownloadJson}>Download JSON</Button>
          <Button className='green-button'>Upload to process</Button>
        </div>
      </div>
      <div className="flex justify-between mb-4">
        <div className="flex items-center">
          <Select
          className='mr-2'
            value={selectedDepartmentId}
            onValueChange={(value) => setSelectedDepartmentId(value)}
            placeholder="Select Department..."
            enableClear={true}
          >
            {departments.department.map((department: any) => (
              <SelectItem
                key={department.id}
                value={department.id}
              >
                <StatusIcon departmentId={department.id}/>
                {department.code}: {department.name}
              </SelectItem>
            ))}
          </Select>
          <TextInput
            icon={MagnifyingGlassIcon}
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
        {filteredExams
        .filter((examData: IExamInfo) => {
          if (selectedDepartmentId === '') return true;
          return examData.departmentId === selectedDepartmentId;
        })
        .map((examData: IExamInfo) => (
          <Card key={examData.id} className="mb-2 p-4">
            <Text className="text-lg font-semibold mb-2">Exam ID: {examData.id}</Text>
            <Text className="text-lg font-semibold mb-2">
              Subject Name:             
              {isMounted && (
                <Badge size="sm" color={departmentColorMapping[examData.departmentId] || 'defaultColor'}>
                  {examData.name}
                </Badge>
              )}
            </Text>
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
                onValueChange={(removedItemId: any) => handleRemovePeriod(examData.id, removedItemId)}
                placeholder="Select Periods"
              >
                {periods.periods.period.map((period: IPeriodInfo) => (
                  <MultiSelectItem key={period.id} value={period.id}>
                    {`${period.day} ${period.time}`}
                  </MultiSelectItem>
                ))}
              </MultiSelect>
            </div>
            <div>
              <Text className="mb-1">Select Room size:</Text>
              <MultiSelect
                value={selectedRooms[examData.id] || []}
                onChange={(selectedItems: any) => handleRoomChange(examData.id, selectedItems)}
                onValueChange={(removedItemId: any) => handleRemoveRoom(examData.id, removedItemId)}
                placeholder="Select Rooms"
              >
                {rooms.rooms.room.map((room: IRoomInfo) => (
                  <MultiSelectItem key={room.id} value={room.id}>
                    {`Room: ${room.id} Size: ${room.size}`}
                  </MultiSelectItem>
                ))}
              </MultiSelect>
            </div>
            <div>
              <Text className="mb-1">Select Instructor:</Text>
              <MultiSelect
                value={selectedInstructors[examData.id] || []}
                onChange={(selectedItems: any) => handleInstructorChange(examData.id, selectedItems)}
                onValueChange={(removedItemId: any) => handleRemoveInstructor(examData.id, removedItemId)}
                placeholder="Select Instructors"
              >
                {instructors.instructors.instructor.map((instructor: Instructor) => (
                  <MultiSelectItem key={instructor.id} value={instructor.id}>
                    {`Instructor: ${instructor.id}`}
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