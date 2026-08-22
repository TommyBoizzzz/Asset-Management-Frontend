import MainLayout from "../../layouts/MainLayout";

function Dashboard() {
    return (
        <MainLayout
            activePage="Dashboard"
            title="Dashboard"
        >
            <div className="p-6">
                <h2 className="text-xl font-semibold">
                    Dashboard Content
                </h2>
            </div>
        </MainLayout>
    );
}

export default Dashboard;