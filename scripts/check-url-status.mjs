


const urls = [
    "https://db-bmtnulmj.sagamuda.cloud/api/files/pbc_1720951369/z7hl622t7qs1rk1/stock_foto_bmtnu_2_xa78pj0u4r.png",
    "https://db-bmtnulmj.sagamuda.cloud/api/files/pbc_1720951369/z7hl622t7qs1rk1/model_01_ducaseh20h.png"
];

async function check() {
    for (const url of urls) {
        try {
            const res = await fetch(url);
            console.log(`URL: ${url}`);
            console.log(`Status: ${res.status} ${res.statusText}`);
            console.log(`Content-Type: ${res.headers.get('content-type')}`);
            console.log(`Content-Length: ${res.headers.get('content-length')}`);
            console.log("-----------------------------------");
        } catch (e) {
            console.error(`Error fetching ${url}:`, e.message);
        }
    }
}

check();
