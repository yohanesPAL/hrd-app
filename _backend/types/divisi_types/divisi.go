package divisitypes

type DivisiRes struct {
	Id       string `json:"id"`
	Nama     string `json:"nama"`
	IsActive bool   `json:"is_active"`
}

type PostDivisiReq struct {
	Nama     string `json:"nama" binding:"required"`
	IsActive bool   `json:"is_active"`
}

type PatchDivisiReq struct {
	Id       string `json:"id" binding:"required"`
	Nama     string `json:"nama" binding:"required"`
	IsActive bool   `json:"is_active"`
}
