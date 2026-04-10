"use client";

import BansosFormPage from "../form";

export default function EditBansosPage({ params }: { params: { id: string } }) {
    return <BansosFormPage isEdit={true} params={params} />;
}
