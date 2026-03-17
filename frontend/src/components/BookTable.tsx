import { Alert, Button, Empty, Table, Tag } from "antd"
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
	books,
	isLoading,
	isError,
	onDelete,
	searchMode,
	totalPages,
	page,
	onPageChange,
}: Props) => {
	if (isError)
		return (
			<Alert
				type="error"
				message={searchMode === "id" ? "Book with this ID not found" : "Loading error"}
			/>
		)

	const columns = [
		{ title: "ID", dataIndex: "id", width: 60 },
		{
			title: "Title",
			dataIndex: "title",
			render: (t: string) => <span style={{ fontWeight: 500 }}>{t}</span>,
		},
		{ title: "Author", dataIndex: "author", render: (a: string) => <Tag color="purple">{a}</Tag> },
		{ title: "Year", dataIndex: "publicationYear", width: 70 },
		{
			title: "",
			width: 90,
			render: (_: any, record: BookResponseDto) => (
				<Button
					danger
					size="small"
					onClick={() => onDelete(record.id)}
				>
					Delete
				</Button>
			),
		},
	]

	return (
		<>
			<Table
				className="book-table-container"
				dataSource={books}
				columns={columns}
				rowKey="id"
				loading={isLoading}
				locale={{ emptyText: <Empty description="No books found" /> }}
				pagination={
					searchMode !== "id"
						? {
								current: page + 1,
								total: totalPages * 10,
								pageSize: 10,
								onChange: (p) => onPageChange(p - 1),
								showSizeChanger: false,
							}
						: false
				}
			/>
			{books.length > 0 && searchMode === "id" && (
				<div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 8 }}>
					Found 1 book · exact match by ID
				</div>
			)}
		</>
	)
}
