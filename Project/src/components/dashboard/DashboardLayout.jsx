import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

export default function DashboardLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#080a12] text-white">
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />
            <div className={`transition-all duration-300 ${collapsed ? 'lg:ml-[72px]' : 'lg:ml-64'}`}>
                <TopNavbar onMenuClick={() => setMobileOpen(true)} />
                <main className="p-4 lg:p-6 min-h-[calc(100vh-64px)]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
