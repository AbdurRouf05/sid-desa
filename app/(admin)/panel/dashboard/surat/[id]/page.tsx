"use client";

import React from "react";
import SuratFormPage from "../form";

export default function EditSuratPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = React.use(params);
    return <SuratFormPage isEdit={true} recordId={resolvedParams.id} />;
}
