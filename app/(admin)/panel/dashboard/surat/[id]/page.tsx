import SuratFormPage from "../form";

export default function EditSuratPage({ params }: { params: { id: string } }) {
    return <SuratFormPage isEdit={true} params={params} />;
}
