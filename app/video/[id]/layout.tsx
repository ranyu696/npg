
export default function DocsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="flex flex-col items-center justify-center gap-4 py-2 md:py-6">
			<div className="flex flex-wrap min-h-screen sm:px-4">
				{children}
				</div>
		</section>
	);
}
