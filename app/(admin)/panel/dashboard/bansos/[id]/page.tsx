"use client";

import React from "react";
import BansosFormPage from "../form";

export default function EditBansosPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = React.use(params);
    return <BansosFormPage isEdit={true} recordId={resolvedParams.id} />;
}
