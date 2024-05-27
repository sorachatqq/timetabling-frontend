'use client';

import { Card, Title, Text, Button, Grid } from '@tremor/react';
import Search from '../component/search';
import FileUpload from '../component/fileUpload';
import mockData from '../../public/json/data.json';
import outputData from '../../public/json/formatted/output4.json';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactNode, JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, useEffect } from 'react';
import { THSarabunNew }  from '../styles/fonts/THSarabunNew';
import { log } from 'console';

interface Exam {
  id: string;
  name: string;
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
  code: string;
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


const tableHeaders = ['วัน/เวลา', 'รหัสวิชา', 'ชื่อวิชา', 'ห้องสอบ', 'section', 'จำนวน', 'กรรมการ'];

export default function ResultPage() {

  const output = outputData as any;
  const examData = output.data.output.examtt.exams.exam;
  const examInputData = output.data.input.examtt.exams.exam;
  const periodData = output.data.output.examtt.periods.period;
  const instructorData = output.data.output.examtt.instructors.instructor;
  
  const findPeriodById = (id: any) => periodData.find((period: any) => period.id === id);
  
  const findInstructorsByExamId = (examId: string) => {
    return instructorData.filter((instructor) =>
      instructor.exam.some((exam) => exam.id === examId)
    );
  };
  
  const findExamInputById = (id: any) => examInputData.find((inputExam: any) => inputExam.id === id);

  const convertToThaiDateTime = (day: string, time: string) => {
    const dayMap: { [key: string]: string } = {
      "Mon": "จันทร์",
      "Tue": "อังคาร",
      "Wed": "พุธ",
      "Thu": "พฤหัสบดี",
      "Fri": "ศุกร์",
      "Sat": "เสาร์",
      "Sun": "อาทิตย์"
    };
  
    const [dayOfWeek, date] = day.split(' ');
    const [startTime, endTime] = time.split(' - ');
  
    const convertTime = (time: string) => {
      let [hour, minute] = time.split(':');
      let period = 'น.';
      if (time.endsWith('a')) {
        period = 'น.';
      } else if (time.endsWith('p')) {
        period = 'น.';
        hour = (parseInt(hour, 10) + 12).toString();
      }
      return `${hour}:${minute.replace(/[ap]/, '')} ${period}`;
    };
  
    const dayInThai = dayMap[dayOfWeek] || dayOfWeek;
    const startTimeInThai = convertTime(startTime);
    const endTimeInThai = convertTime(endTime);
  
    return `${dayInThai} ${date} ${startTimeInThai} - ${endTimeInThai}`;
  };
  
  const mappedExams = examData.map((exam: {
    assignment: { period: { id: any; }; room: { id: any; } | { id: any; }[]; };
    id: any;
    name: any;
    enrl: any;
    section: any;
    code: any;
  }) => {
    const period = findPeriodById(exam.assignment.period.id);
    const instructors = findInstructorsByExamId(exam.id);
    const inputExam = findExamInputById(exam.id);
  
    return {
      courseCode: inputExam ? inputExam.code : exam.id,
      courseName: exam.name,
      classroom: getRoomIds(exam.assignment.room),
      time: period ? convertToThaiDateTime(period.day, period.time) : '',
      section: inputExam ? inputExam.section : exam.section,  // Use section from inputExam if available
      instructor: instructors.map(instr => instr.id).join(', '),
      student: exam.enrl,
      code: inputExam ? inputExam.code : exam.code,  // Use code from inputExam if available
    };
  });
  
    console.log(examInputData);
  
  
    const exportPDF = () => {
      const pdf = new jsPDF({
        orientation: 'landscape',
      });
    
      const fontName = 'THSarabunNew';
      pdf.addFileToVFS(`${fontName}.ttf`, THSarabunNew.split(',')[1]);
      pdf.addFont(`${fontName}.ttf`, fontName, 'normal');
      pdf.setFont(fontName);
    
      const tableColumnHeaders = ['วัน/เวลา', 'รหัสวิชา', 'ชื่อวิชา', 'ห้องสอบ', 'section', 'จำนวน', 'กรรมการ'];
    
      // Group exams by day
      const examsGroupedByDay: { [key: string]: any[] } = {};
      mappedExams.forEach(exam => {
        const day = exam.time.split(' ')[0]; // Extract the day part
        if (!examsGroupedByDay[day]) {
          examsGroupedByDay[day] = [];
        }
        examsGroupedByDay[day].push(exam);
      });
    
      // Create table rows with grouping logic
      const tableRows: any[] = [];
      Object.keys(examsGroupedByDay).forEach(day => {
        const exams = examsGroupedByDay[day];
        exams.forEach((exam, index) => {
          tableRows.push([
            index === 0 ? exam.time : '', // Only show the day for the first exam in the group
            exam.code,
            exam.courseName,
            exam.classroom,
            exam.section,
            exam.student,
            exam.instructor,
          ]);
        });
      });
    
      pdf.setFontSize(16);
      pdf.text('ตารางสอบ', 105, 20, { align: 'center' });
    
      autoTable(pdf, {
        head: [tableColumnHeaders],
        body: tableRows,
        startY: 25,
        styles: {
          font: fontName,
        },
      });
    
      pdf.save('exam_schedule.pdf');
    };
    

  useEffect(() => {
    const button = document.getElementById('export-button');
    if (button) {
      button.addEventListener('click', exportPDF);
    }
  }, []);

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
            {examData.map((exam: { id: boolean | Key | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | PromiseLikeOfReactNode | null | undefined; alt: any; best: { room: { id: string; } | { id: string; }[]; period: { id: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; }; }; enrl: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; assignment: { room: { id: string; } | { id: string; }[]; period: { id: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; }; }; average: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; printOffset: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; }) => (
              <tr key={exam?.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b border-gray-200 text-center align-middle">{exam?.id}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-center align-middle">{exam.alt ? 'Yes' : 'No'}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-center align-middle">{getRoomIds(exam.best.room)}</td>
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
        <Card className="mb-8">
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
              {instructorData.map((instructor: { id: boolean | Key | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | PromiseLikeOfReactNode | null | undefined; exam: { id: string; }[]; }) => (
                <tr key={instructor.id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b border-gray-200 text-center align-middle">{instructor?.name}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-center align-middle">{getExamIds(instructor.exam)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </Card>

        <Card className="mb-8">
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
                {periodData.map((period: { id: boolean | Key | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | PromiseLikeOfReactNode | null | undefined; day: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; time: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; length: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; penalty: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; }) => (
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

      
      <Card className="mb-8" >
      <div className="overflow-x-auto">
      <Title>RESULT TABLE</Title>

        <table className="min-w-full bg-white">
          <thead>
          <tr>
              {tableHeaders.map(header => (
                <th key={header} className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600 border-b border-gray-200 text-center align-middle">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mappedExams.map((exam: { time: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; courseCode: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; courseName: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; classroom: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; section: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; student: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; instructor: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; }, index: Key | null | undefined) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b border-gray-200 text-center align-middle">{exam.time}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-center align-middle">{exam.courseCode}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-center align-middle">{exam.courseName}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-center align-middle">{exam.classroom}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-center align-middle">{exam.section}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-center align-middle">{exam.student}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-center align-middle">{exam.instructor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </Card>

      <div className="flex justify-end items-center mt-4">
        <Button id="export-button" className="ml-auto">Export</Button>
      </div>
    </main>
    );
}