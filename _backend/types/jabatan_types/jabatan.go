package jabatantypes

type JabatanRes struct {
	Id       string `json:"id"`
	IdDivisi string `json:"id_divisi"`
	Nama     string `json:"nama"`
	IsActive bool   `json:"is_active"`
}

type PostJabatanReq struct {
	IdDivisi string `json:"id_divisi" binding:"required"`
	Nama     string `json:"nama" binding:"required"`
	IsActive string `json:"is_active" binding:"required"`
}

type PatchJabatanReq struct {
	Id       string `json:"id" binding:"required"`
	IdDivisi string `json:"id_divisi" binding:"required"`
	Nama     string `json:"nama" binding:"required"`
	IsActive string `json:"is_active" binding:"required"`
}
