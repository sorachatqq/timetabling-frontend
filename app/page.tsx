
import { sql } from '@vercel/postgres';
import { Card, Title, Text, Button } from '@tremor/react';
import Search from './component/search';
import FileUpload from './component/fileUpload';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  const search = searchParams.q ?? '';

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Upload File</Title>
      <Text>Find your uploaded file.</Text>
      <div className="flex justify-end items-center">
        <Search />
        <Button className="ml-auto">Download Template</Button>
      </div>
      <Card className="mt-6">
        <FileUpload></FileUpload>
      </Card>
    </main>
  );
}
