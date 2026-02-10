package absendivisitypes

type GetAbsenDivisiTableRes struct {
	Urutan      int    `json:"urutan"`
	Id          string `json:"id"`
	KodeDiv     string `json:"kode_divisi"`
	NamaDiv     string `json:"nama_divisi"`
	Masuk       string `json:"masuk"`
	Keluar      string `json:"keluar"`
	KeluarSabtu string `json:"keluar_sabtu"`
}

type PatchAbsenDivisiReq struct {
	Id          string `json:"id" binding:"required"`
	Masuk       int    `json:"masuk" binding:"required"`
	Keluar      int    `json:"keluar" binding:"required"`
	KeluarSabtu int    `json:"keluar_sabtu" binding:"required"`
}

type GetAbsenDivisiRes struct {
	KodeDiv     string `json:"kode_divisi"`
	Masuk       int    `json:"masuk"`
	Keluar      int    `json:"keluar"`
	KeluarSabtu int    `json:"keluar_sabtu"`
}
