import GetText from "../components/GetText";
import SaveText from "../components/SaveText";
import Backdrop from "../ez/Backdrop";
import { Stagger, StaggerItem } from "../ez/motion";
import { Brand, Shell } from "../ez/Shell";

const Landing = () => (
	<Shell brand={<Brand name="ezjot" glyph="jt" scope="Self-hosted text sharing" />} width="max-w-[1080px]">
		<div className="flex min-h-[calc(100dvh-7.5rem)] flex-col">
			<section className="relative isolate mb-8 min-h-[150px] pt-6 pb-8">
				<Backdrop className="-z-10 left-auto hidden w-[45%] md:block" opacity={0.5} nodes={14} />
				<h1 className="text-[24px] font-semibold tracking-[-0.01em] text-ink">Jot it down. Share it anywhere.</h1>
				<p className="mt-1 max-w-md text-[14px] text-mute">
					Save a note, share its key. Optional password, optional burn after reading.
				</p>
			</section>

			<Stagger className="mb-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
				<StaggerItem>
					<SaveText />
				</StaggerItem>
				<StaggerItem>
					<GetText />
				</StaggerItem>
			</Stagger>

			<footer className="mt-auto pt-5 flex items-center justify-between border-t border-line text-[12px] text-mute">
				<span>
					ezjot <span className="font-mono">v2.1.0</span>
				</span>
				<span>Self-hosted · no tracking</span>
			</footer>
		</div>
	</Shell>
);

export default Landing;
