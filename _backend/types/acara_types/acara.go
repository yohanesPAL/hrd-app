package acaratypes

import "time"

type GetAcaraDashBoardRes struct {
	Title string    `json:"title"`
	Start time.Time `json:"start"`
	End   time.Time `json:"end"`
}

type GetAcaraRes struct {
	Id    string    `json:"id"`
	Title string    `json:"title"`
	Start time.Time `json:"start"`
	End   time.Time `json:"end"`
}

type PostAcaraReq struct {
	Title string `json:"title" binding:"required"`
	Start string `json:"start" binding:"required"`
	End   string `json:"end" binding:"required"`
}

type PatchAcaraReq struct {
	Id    string `json:"id" binding:"required"`
	Title string `json:"title" binding:"required"`
	Start string `json:"start" binding:"required"`
	End   string `json:"end" binding:"required"`
}
