
import { sql } from '@vercel/postgres';
import { Card, Title, Text, Button, Grid } from '@tremor/react';
import Search from '../component/search';
import FileUpload from '../component/fileUpload';
import mockData from '../../public/json/data.json';
import { GetServerSideProps } from 'next';

interface Exam {
  id: string;
  alt: boolean;
  best: {
    room: { id: string; };
    period: { id: string; };
  };
  enrl: string;
  room: Array<{ id: string; }>;
  length: string;
  period: Array<{ id: string; }>;
  average: string;
  assignment: {
    room: { id: string; };
    period: { id: string; };
  };
  printOffset: string;
}

// Interface for a period
interface Period {
  id: string;
  day: string;
  time: string;
  length: string;
  penalty: string;
}

interface Instructor {
  id: string;
  exam: Array<{ id: string; }>;
}

interface OutputData {
  exams: Exam[];
  periods: Period[];
  instructors: Instructor[];
}

interface TimetableData {
  data: {
    id: number;
    input: any;
    output: OutputData;
    accepted_at: string;
    completed_at: string;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
  };
}

const dummyData: TimetableData = {
  data: {
    id: 1,
    input: {}, 
    output: {
      exams: [], 
      periods: [],
      instructors: [], 
    },
    accepted_at: "",
    completed_at: "",
    deleted_at: null,
    created_at: "",
    updated_at: "",
  },
};

const getRoomIds = (room: { id: string; } | { id: string; }[]): string => {
  if (Array.isArray(room)) {
    return room.map(r => r.id).join(', ');
  } else {
    return room.id;
  }
};

const getExamIds = (exams: { id: string }[]): string => {
  return exams.map((exam) => exam.id).join(', ');
};

export const ResultPage: GetServerSideProps = async (context) => {

  const examData = mockData.data.output.examtt.exams.exam;
  const periodData = mockData.data.output.examtt.periods.period;
  const instructorData = mockData.data.output.examtt.instructors.instructor;

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Card className="mb-8">
      <div className="overflow-x-auto">
      <Title>OUTPUT</Title>

        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600 border-b border-gray-200 text-center align-middle">Exam ID</th>
              <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600 border-b border-gray-200 text-center align-middle">Alternative</th>
              <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600 border-b border-gray-200 text-center align-middle">Best Room</th>
              <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600 border-b border-gray-200 text-center align-middle">Best Period</th>
              <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600 border-b border-gray-200 text-center align-middle">Enrollment</th>
              <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600 border-b border-gray-200 text-center align-middle">Assigned Room</th>
              <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600 border-b border-gray-200 text-center align-middle">Assigned Period</th>
              <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600 border-b border-gray-200 text-center align-middle">Average</th>
              <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600 border-b border-gray-200 text-center align-middle">Print Offset</th>
            </tr>
          </thead>
          <tbody key={1}>
            {examData.map((exam) => (
              <tr key={exam.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b border-gray-200 text-center align-middle">{exam.id}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-center align-middle">{exam.alt ? 'Yes' : 'No'}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-center align-middle">{getRoomIds(exam.room)}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-center align-middle">{exam.best.period.id}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-center align-middle">{exam.enrl}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-center align-middle">{getRoomIds(exam.assignment.room)}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-center align-middle">{exam.assignment.period.id}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-center align-middle">{exam.average}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-center align-middle">{exam.printOffset}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </Card>

      <Grid numItemsSm={1} numItemsLg={2} className="gap-6">
        <Card>
          <div className="overflow-x-auto">
          <Title>INSTRUCTOR</Title>

          <table className="min-w-full bg-white table table-fixed">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600 border-b border-gray-200 text-center align-middle text-center align-middle">ID</th>
                <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600 border-b border-gray-200 text-center align-middle text-center align-middle">Exam ID</th>
              </tr>
            </thead>
            <tbody key={2}>
              {instructorData.map((instructor) => (
                <tr key={instructor.id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b border-gray-200 text-center align-middle">{instructor.id}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-center align-middle">{getExamIds(instructor.exam)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </Card>

        <Card>
          <div className="overflow-x-auto">
          <Title>PERIOD</Title>

            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600 border-b border-gray-200 text-center align-middle text-center align-middle">ID</th>
                  <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600 border-b border-gray-200 text-center align-middle text-center align-middle">Day</th>
                  <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600 border-b border-gray-200 text-center align-middle text-center align-middle">Time</th>
                  <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600 border-b border-gray-200 text-center align-middle text-center align-middle">Length (min)</th>
                  <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600 border-b border-gray-200 text-center align-middle text-center align-middle">Penalty</th>
                </tr>
              </thead>
              <tbody key={3}>
                {periodData.map((period) => (
                  <tr key={period.id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b border-gray-200 text-center align-middle">{period.id}</td>
                    <td className="py-2 px-4 border-b border-gray-200 text-center align-middle">{period.day}</td>
                    <td className="py-2 px-4 border-b border-gray-200 text-center align-middle">{period.time}</td>
                    <td className="py-2 px-4 border-b border-gray-200 text-center align-middle">{period.length}</td>
                    <td className="py-2 px-4 border-b border-gray-200 text-center align-middle">{period.penalty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Grid>
      <div className="flex justify-end items-center mt-4">
        <Button className="ml-auto">Export</Button>
      </div>
    </main>
    );
};

export default ResultPage;