import Card from '@/components/card';
import { ROUTES } from '@/lib/routes';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center space-y-4">
      <h1>Ordbank</h1>
      <Card title="Add Word" link={ROUTES.ADD_WORD} className="w-1/3"></Card>
      <Card title="Test" link={ROUTES.TEST} className="w-1/3"></Card>
    </main>
  );
}
