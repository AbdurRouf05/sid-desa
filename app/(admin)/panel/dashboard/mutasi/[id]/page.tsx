import MutasiFormPage from "../form";

export default function EditMutasiPage({ params }: { params: { id: string } }) {
    return <MutasiFormPage isEdit={true} params={params} />;
}
