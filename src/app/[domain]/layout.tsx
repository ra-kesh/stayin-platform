import type React from "react";

const DomainLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<div>DomainLayout</div>
			<div>{children}</div>
		</>
	);
};

export default DomainLayout;
