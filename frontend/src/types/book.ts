export interface BookResponseDto {
	id: number
	title: string
	author: string
	publicationYear: number
}

export interface BookRequestDto {
	title: string
	author: string
	publicationYear: number
}

export interface PageResponse<T> {
	content: T[]
	totalElements: number
	totalPages: number
	number: number
}
