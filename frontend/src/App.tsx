import { useRef, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BooksTable } from "./components/BookTable"
import { SearchBar } from "./components/SearchBar"
import { useBooks } from "./hooks/useBooks"
import type { BookRequestDto } from "./types/book"
import "./App.css"

const queryClient = new QueryClient()

interface FormErrors {
	title?: string
	author?: string
	publicationYear?: string
}

const BooksPage = () => {
	const { books, isLoading, isError, searchMode, setSearchMode, searchValue,
		setSearchValue, page, setPage, totalPages, handleSearch, handleReset,
		createMutation, deleteMutation, committedSearch,
	} = useBooks()

	const titleRef  = useRef<HTMLInputElement>(null)
	const authorRef = useRef<HTMLInputElement>(null)
	const yearRef   = useRef<HTMLInputElement>(null)
	const [errors, setErrors] = useState<FormErrors>({})
	const [toast, setToast]   = useState<{ msg: string; type: "ok" | "err" } | null>(null)

	const showToast = (msg: string, type: "ok" | "err") => {
		setToast({ msg, type })
		setTimeout(() => setToast(null), 3000)
	}

	const validate = (): BookRequestDto | null => {
		const title  = titleRef.current?.value.trim() ?? ""
		const author = authorRef.current?.value.trim() ?? ""
		const year   = Number(yearRef.current?.value)
		const errs: FormErrors = {}
		if (!title)       errs.title  = "Title is required"
		if (!author)      errs.author = "Author is required"
		if (!year || year < 1450) errs.publicationYear = "Year ≥ 1450"
		setErrors(errs)
		if (Object.keys(errs).length) return null
		return { title, author, publicationYear: year }
	}

	const onAddBook = (e: React.FormEvent) => {
		e.preventDefault()
		const dto = validate()
		if (!dto) return
		createMutation.mutate(dto, {
			onSuccess: () => {
				if (titleRef.current)  titleRef.current.value  = ""
				if (authorRef.current) authorRef.current.value = ""
				if (yearRef.current)   yearRef.current.value   = ""
				setErrors({})
				showToast("Book added ✓", "ok")
				handleReset()
			},
			onError: () => showToast("Error adding book", "err"),
		})
	}

	const onDelete = (id: number) => {
		deleteMutation.mutate(id, {
			onSuccess: () => showToast("Book deleted", "ok"),
		})
	}

	return (
		<div className="page">
			{toast && <div className={`toast toast--${toast.type}`}>{toast.msg}</div>}

			<header className="page-header">
				<h1 className="page-title">Library</h1>
				<p className="page-subtitle">Book catalog management</p>
			</header>

			{/* ── Add-book form ─────────────────────────────────── */}
			<section className="section-card">
				<h2 className="section-title">Add New Book</h2>
				<form className="add-form" onSubmit={onAddBook} noValidate>
					<div className="add-form__group">
						<input
							ref={titleRef}
							className={`field${errors.title ? " field--error" : ""}`}
							placeholder="Book title"
							type="text"
						/>
						{errors.title && <span className="field-err">{errors.title}</span>}
					</div>

					<div className="add-form__group">
						<input
							ref={authorRef}
							className={`field${errors.author ? " field--error" : ""}`}
							placeholder="Author"
							type="text"
						/>
						{errors.author && <span className="field-err">{errors.author}</span>}
					</div>

					<div className="add-form__group">
						<input
							ref={yearRef}
							className={`field field--year${errors.publicationYear ? " field--error" : ""}`}
							placeholder="Year"
							type="number"
							min={1450}
						/>
						{errors.publicationYear && <span className="field-err">{errors.publicationYear}</span>}
					</div>

					<button
						type="submit"
						className="btn btn--primary"
						disabled={createMutation.isPending}
					>
						{createMutation.isPending ? "Adding…" : "+ Add Book"}
					</button>
				</form>
			</section>

			{/* ── Search ────────────────────────────────────────── */}
			<section className="section-card">
				<h2 className="section-title">Search Catalog</h2>
				<div className="search-wrap">
					<SearchBar
						mode={searchMode}
						value={searchValue}
						onModeChange={setSearchMode}
						onValueChange={setSearchValue}
						onSearch={handleSearch}
						onReset={handleReset}
					/>
				</div>
			</section>

			{/* ── Table ─────────────────────────────────────────── */}
			<section className="section-card">
				<h2 className="section-title">Book List</h2>
				<BooksTable
					books={books}
					isLoading={isLoading}
					isError={isError}
					onDelete={onDelete}
					searchMode={committedSearch.mode}
					totalPages={totalPages}
					page={page}
					onPageChange={setPage}
				/>
			</section>
		</div>
	)
}

export default () => (
	<QueryClientProvider client={queryClient}>
		<BooksPage />
	</QueryClientProvider>
)
