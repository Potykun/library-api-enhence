import type { SearchMode } from "../hooks/useBooks"

interface Props {
	mode: SearchMode
	value: string
	onModeChange: (m: SearchMode) => void
	onValueChange: (v: string) => void
	onSearch: () => void
	onReset: () => void
}

const MODES: { key: SearchMode; label: string; placeholder: string }[] = [
	{ key: "all", label: "All", placeholder: "Click Find to load all" },
	{ key: "title", label: "Title", placeholder: 'e.g. "Clean Code"' },
	{ key: "author", label: "Author", placeholder: 'e.g. "Martin"' },
	{ key: "id", label: "ID", placeholder: "e.g. 3" },
]

export const SearchBar = ({
	mode,
	value,
	onModeChange,
	onValueChange,
	onSearch,
	onReset,
}: Props) => {
	const active = MODES.find((m) => m.key === mode)!

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
			{/* Mode tabs */}
			<div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
				{MODES.map((m) => (
					<button
						key={m.key}
						onClick={() => {
							if (m.key === "all") {
								onReset()
							} else {
								onModeChange(m.key)
								onValueChange("")
							}
						}}
						style={{
							border: "2px solid #000",
							borderRadius: 8,
							padding: "8px 4px",
							fontWeight: 700,
							fontSize: 13,
							cursor: "pointer",
							background: mode === m.key ? "#FFD600" : "#fff",
							boxShadow: mode === m.key ? "3px 3px 0 #000" : "none",
							transition: "all .15s",
							color: "#000",
						}}
					>
						{m.label}
					</button>
				))}
			</div>

			{/* Input field + buttons */}
			<div style={{ display: "flex", gap: 8 }}>
				<input
					style={{
						flex: 1,
						border: "2px solid #000",
						borderRadius: 8,
						padding: "10px 14px",
						fontSize: 14,
						background: mode === "all" ? "#f0f0f0" : "#fff",
						opacity: mode === "all" ? 0.6 : 1,
						color: "#000",
					}}
					placeholder={active.placeholder}
					value={value}
					disabled={mode === "all"}
					type={mode === "id" ? "number" : "text"}
					onChange={(e) => onValueChange(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && onSearch()}
				/>
				<button
					onClick={onSearch}
					style={{
						border: "2px solid #000",
						borderRadius: 8,
						padding: "10px 18px",
						fontWeight: 700,
						fontSize: 14,
						background: "#FFD600",
						boxShadow: "3px 3px 0 #000",
						cursor: "pointer",
					}}
				>
					Find
				</button>
				<button
					onClick={onReset}
					style={{
						border: "2px solid #000",
						borderRadius: 8,
						padding: "10px 14px",
						fontWeight: 700,
						fontSize: 14,
						background: "#fff",
						boxShadow: "3px 3px 0 #000",
						cursor: "pointer",
						color: "#000",
					}}
				>
					✕
				</button>
			</div>
		</div>
	)
}
