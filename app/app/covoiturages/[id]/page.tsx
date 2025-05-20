import CovoiturageDetail from '@/app/components/CovoiturageDetails';

export default function Page({ params }: { params: { id: string } }) {
  return <CovoiturageDetail id={params.id} />;
}
