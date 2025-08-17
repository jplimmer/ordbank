import Card from '@/components/Card';
import { ROUTES } from '@/lib/routes';

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center gap-4 min-h-full">
      <h1 className="mb-4">Ordbank</h1>
      <Card title="Add Word" link={ROUTES.ADD_WORD} className="w-1/2"></Card>
      <Card title="Test" link={ROUTES.TEST} className="w-1/2"></Card>
    </main>
  );
}
