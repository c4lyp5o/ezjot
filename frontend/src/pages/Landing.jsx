import SaveText from "../components/SaveText";
import GetText from "../components/GetText";

const Landing = () => {
	return (
		<div className="min-h-screen flex flex-col">
			<header className="sticky top-0 z-10 bg-paper/85 backdrop-blur border-b border-stone-200/80">
				<div className="max-w-5xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
					<a
						href="/"
						className="font-mono text-sm tracking-tight text-ink"
						aria-label="EZJOT home"
					>
						ezjot<span className="text-accent-600">.</span>
					</a>
					<span className="text-xs text-stone-400 font-mono hidden sm:inline">
						jot down anything
					</span>
				</div>
			</header>

			<main className="flex-1 w-full max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-16">
				<section className="text-center mb-10 sm:mb-14">
					<h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-ink">
						Jot it down.
						<span className="text-accent-600"> Share it anywhere.</span>
					</h1>
				</section>

				<section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
					<div className="p-1">
						<SaveText />
					</div>

					<div className="p-1">
						<GetText />
					</div>
				</section>
			</main>

			<footer className="border-t border-stone-200/80">
				<div className="max-w-5xl mx-auto px-5 sm:px-8 py-6 flex items-center justify-between text-xs text-stone-400">
					<span className="font-mono">ezjot v2.1.0</span>
					<span>self-hosted · no tracking</span>
				</div>
			</footer>
		</div>
	);
};

export default Landing;
