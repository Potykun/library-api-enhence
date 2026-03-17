import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Form, Input, InputNumber, Button, message } from "antd"
import { useBooks } from "./hooks/useBooks"
import { SearchBar } from "./components/SearchBar"
import { BooksTable } from "./components/BookTable"
import type { BookRequestDto } from "./types/book"

const queryClient = new QueryClient()

const BooksPage = () => {
	const [form] = Form.useForm()
	const {
		books,
		isLoading,
		isError,
		searchMode,
		setSearchMode,
		searchValue,
		setSearchValue,
		page,
		setPage,
		totalPages,
		handleSearch,
		handleReset,
		createMutation,
		deleteMutation,
		committedSearch,
	} = useBooks()

	const onAddBook = (values: BookRequestDto) => {
		createMutation.mutate(values, {
			onSuccess: () => {
				form.resetFields()
				message.success("Book added")
				handleReset()
			},
			onError: () => message.error("Error adding book"),
		})
	}

	const onDelete = (id: number) => {
		deleteMutation.mutate(id, {
			onSuccess: () => message.success("Book deleted"),
		})
	}

	return (
		<div style={{ maxWidth: 860, margin: "40px auto", padding: "0 16px" }}>
			<h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 4 }}>Library</h1>
			<p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 24 }}>
				Book catalog management
			</p>

			<Form
				form={form}
				layout="inline"
				onFinish={onAddBook}
				style={{ marginBottom: 8, flexWrap: "wrap", gap: 8 }}
			>
				<Form.Item
					name="title"
					rules={[{ required: true, message: "Enter title" }]}
				>
					<Input
						placeholder="Book title"
						style={{ width: 200 }}
					/>
				</Form.Item>
				<Form.Item
					name="author"
					rules={[{ required: true, message: "Enter author" }]}
				>
					<Input
						placeholder="Author"
						style={{ width: 160 }}
					/>
				</Form.Item>
				<Form.Item
					name="publicationYear"
					rules={[{ required: true }]}
				>
					<InputNumber
						placeholder="Year"
						min={1450}
						style={{ width: 90 }}
					/>
				</Form.Item>
				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
						loading={createMutation.isPending}
					>
						+ Add
					</Button>
				</Form.Item>
			</Form>

			<div style={{ marginBottom: '24px' }}>
			<SearchBar
				mode={searchMode}
				value={searchValue}
				onModeChange={setSearchMode}
				onValueChange={setSearchValue}
				onSearch={handleSearch}
				onReset={handleReset}
			/>
			</div>

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
		</div>
	)
}

export default () => (
	<QueryClientProvider client={queryClient}>
		<BooksPage />
	</QueryClientProvider>
)
