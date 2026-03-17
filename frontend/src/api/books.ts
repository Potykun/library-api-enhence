import axios from "axios"
import type { BookRequestDto, BookResponseDto, PageResponse } from "../types/book"

const api = axios.create({ baseURL: "/api" })

export const getBooks = (page = 0, author = "", title = "") =>
	api
		.get<PageResponse<BookResponseDto>>("/books", {
			params: {
				page,
				size: 10,
				...(author.trim() ? { author: author.trim() } : {}),
				...(title.trim() ? { title: title.trim() } : {}),
			},
		})
		.then((r) => r.data)

export const getBookById = (id: number) =>
	api.get<BookResponseDto>("/books/" + id).then((r) => r.data)

export const createBook = (dto: BookRequestDto) =>
	api.post<BookResponseDto>("/books", dto).then((r) => r.data)

// Soft Delete
export const deleteBook = (id: number) => api.delete("/books/" + id)
