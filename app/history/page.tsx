'use client'
import Search from '@/component/search';
import { Card, Title, Text, Button } from '@tremor/react';
import { useRouter } from 'next/navigation'

interface ICardInfo {
  id: number;
  created_at: string;
  status: 'Success' | 'Pending' | 'Failed'; // Use union type directly here
}

const mock_card: ICardInfo[] = [
  {
    id: 1,
    created_at: '21/11/2023 19:20:25',
    status: "Success"
  },
  {
    id: 2,
    created_at: '19/11/2023 16:12:55',
    status: "Failed"
  },
  {
    id: 3,
    created_at: '16/11/2023 13:51:32',
    status: "Success"
  },
  {
    id: 4,
    created_at: '15/11/2023 13:51:32',
    status: "Pending"
  },
];

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

    const handleCardClick = (id: number) => {
        router.push(`/result/${id}`);
    };

    return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div className="flex justify-end items-center mb-4">
        <Title className='mr-auto'>Transaction List</Title>
        <Search/>
      </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mock_card.map((cardData) => (
            <Card key={cardData.id} className="mb-2 p-4" onClick={() => handleCardClick(cardData.id)}>
            <Text className="text-lg font-semibold mb-2">Task ID: {cardData.id}</Text>
            <Text className="mb-1">Created At: {cardData.created_at}</Text>
            <div className="flex items-center">
                <Text className='mr-2'>Status: {cardData.status}</Text>
                <StatusIcon status={cardData.status} />
            </div>
            </Card>
        ))}
        </div>
    </main>
    );
}
