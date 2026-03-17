import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { createBook, deleteBook, getBookById, getBooks } from "../api/books"
import type { BookRequestDto } from "../types/book"

// ↓ CHANGED: added 'title'
export type SearchMode = "all" | "title" | "author" | "id"

export function useBooks() {
	const qc = useQueryClient()
	const [searchMode, setSearchMode] = useState<SearchMode>("all")
	const [searchValue, setSearchValue] = useState("")
	const [committed, setCommitted] = useState({
		mode: "all" as SearchMode,
		value: "",
	})
	const [page, setPage] = useState(0)

	const listQuery = useQuery({
		queryKey: ["books", "list", committed, page],
		queryFn: () =>
			getBooks(
				page,
				committed.mode === "author" ? committed.value : "",
				committed.mode === "title" ? committed.value : "",
			),
		enabled: committed.mode !== "id",
	})

	const idQuery = useQuery({
		queryKey: ["books", "id", committed.value],
		queryFn: () => getBookById(Number(committed.value)),
		enabled: committed.mode === "id" && !!committed.value,
		retry: false,
	})

	const handleSearch = () => {
		setPage(0)
		setCommitted({ mode: searchMode, value: searchValue })
	}

	const handleReset = () => {
		setSearchValue("")
		setSearchMode("all")
		setPage(0)
		setCommitted({ mode: "all", value: "" })
	}

	const createMutation = useMutation({
		mutationFn: (dto: BookRequestDto) => createBook(dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["books"] }),
	})

	const deleteMutation = useMutation({
		mutationFn: (id: number) => deleteBook(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["books"] }),
	})

	const books =
		committed.mode === "id" ? (idQuery.data ? [idQuery.data] : []) : (listQuery.data?.content ?? [])

	const isLoading = committed.mode === "id" ? idQuery.isLoading : listQuery.isLoading

	const isError = committed.mode === "id" ? idQuery.isError : listQuery.isError

	return {
		books,
		isLoading,
		isError,
		searchMode,
		setSearchMode,
		searchValue,
		setSearchValue,
		page,
		setPage,
		totalPages: listQuery.data?.totalPages ?? 0,
		handleSearch,
		handleReset,
		createMutation,
		deleteMutation,
		committedSearch: committed,
	}
}
