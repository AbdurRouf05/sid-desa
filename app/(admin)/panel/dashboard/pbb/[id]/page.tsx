"use client";

import PbbFormPage from "../form";

export default function EditPbbPage({ params }: { params: { id: string } }) {
    return <PbbFormPage isEdit={true} params={params} />;
}
