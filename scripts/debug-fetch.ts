
(async () => {
    const url = "https://scontent.fmlg8-1.fna.fbcdn.net/v/t39.30808-6/494441207_1487429096033258_4854043116706845221_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeH5QB2roFbLq5mjxeEL0je0K4Mmzi45ySArgybOLjnJIDS4-HyiGUPYRu7SRSvpvX8FMn2hnn3gQrgXEpocDzi4&_nc_ohc=dQASYFY0oKoQ7kNvwFCicnj&_nc_oc=AdkZF1xHSUIfAeU_9oU4IyixMDTH0oIjuLUkfSRbj6hH7MyOYu9Y2M4Ee03q5bYovS0&_nc_zt=23&_nc_ht=scontent.fmlg8-1.fna&_nc_gid=AJ55hKXDvgtwYTVBTrRnhQ&oh=00_AftLZq_1xqEs4bmh_UqxBfccJuQ-p-AldTdcR2iGNw2A5Q&oe=6985D9E4";
    console.log("Starting fetch...", url);
    try {
        const res = await fetch(url);
        console.log("Status:", res.status);
        console.log("Type:", res.headers.get('content-type'));
        const blob = await res.blob();
        console.log("Blob size:", blob.size);
    } catch (e) {
        console.error("FETCH ERROR:", e);
    }
})();
