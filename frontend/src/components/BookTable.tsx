import type { BookResponseDto } from "../types/book"

interface Props {
	books: BookResponseDto[]
	isLoading: boolean
	isError: boolean
	onDelete: (id: number) => void
	searchMode: string
	totalPages: number
	page: number
	onPageChange: (p: number) => void
}

export const BooksTable = ({
	books, isLoading, isError, onDelete,
	searchMode, totalPages, page, onPageChange,
}: Props) => {
	if (isError)
		return (
			<div className="alert alert--error">
				{searchMode === "id" ? "Book with this ID not found" : "Loading error"}
			</div>
		)

	if (isLoading)
		return (
			<div className="table-state">
				<span className="spinner" />
				Loading…
			</div>
		)

	if (books.length === 0)
		return <div className="table-state table-state--empty">No books found</div>

	return (
		<div className="table-wrap">
			<table className="book-table">
				<thead>
					<tr>
						<th className="col-num">#</th>
						<th>Title</th>
						<th>Author</th>
						<th className="col-year">Year</th>
						<th className="col-id">ID</th>
						<th className="col-action" />
					</tr>
				</thead>
				<tbody>
					{books.map((b, i) => (
						<tr key={b.id} className="book-row">
							<td className="col-num">{page * 10 + i + 1}</td>
							<td className="col-title">{b.title}</td>
							<td><span className="author-tag">{b.author}</span></td>
							<td className="col-year">{b.publicationYear}</td>
							<td className="col-id">{b.id}</td>
							<td className="col-action">
								<button
									className="btn btn--danger btn--sm"
									onClick={() => onDelete(b.id)}
								>
									Delete
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{searchMode !== "id" && totalPages > 1 && (
				<div className="pagination">
					<button
						className="btn btn--ghost btn--sm"
						disabled={page === 0}
						onClick={() => onPageChange(page - 1)}
					>
						‹ Prev
					</button>
					<span className="pagination__info">
						Page {page + 1} / {totalPages}
					</span>
					<button
						className="btn btn--ghost btn--sm"
						disabled={page >= totalPages - 1}
						onClick={() => onPageChange(page + 1)}
					>
						Next ›
					</button>
				</div>
			)}

			{books.length > 0 && searchMode === "id" && (
				<p className="table-hint">Found 1 book · exact match by ID</p>
			)}
		</div>
	)
}
