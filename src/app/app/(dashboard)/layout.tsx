import type React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<div>DashboardLayout</div>
			{children}
		</>
	);
};

export default DashboardLayout;
