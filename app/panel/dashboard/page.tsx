export default function AdminDashboard() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Dashboard Admin</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h3 className="text-sm font-medium text-slate-500">Total Produk</h3>
                    <p className="text-2xl font-bold text-slate-800 mt-2">12</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h3 className="text-sm font-medium text-slate-500">Berita Diposting</h3>
                    <p className="text-2xl font-bold text-slate-800 mt-2">45</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h3 className="text-sm font-medium text-slate-500">Pengunjung Hari Ini</h3>
                    <p className="text-2xl font-bold text-slate-800 mt-2">1,204</p>
                </div>
            </div>
        </div>
    );
}
