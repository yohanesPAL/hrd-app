package absentypes

type PostAbsenReq struct {
	AbsenId    string `json:"absen_id" binding:"required"`
	NamaAbsen  string `json:"nama_absen" binding:"required"`
	DivisiId   string `json:"divisi_id" binding:"required"`
	Tanggal    string `json:"tanggal" binding:"required"`
	ScanMasuk  string `json:"scan_masuk"`
	ScanKeluar string `json:"scan_keluar"`
	Terlambat  int    `json:"terlambat"`
	Lembur     int    `json:"lembur"`
	Absent     bool   `json:"absent"`
	JamKerja   int    `json:"jam_kerja"`
}

type GetAbsenRes struct {
	AbsenId        string `json:"absen_id"`
	Nama           string `json:"nama"`
	Divisi         string `json:"divisi"`
	JumlahAbsen    int    `json:"jumlah_absen"`
	TotalTerlambat int    `json:"total_terlambat"`
	TotalLembur    int    `json:"total_lembur"`
	TotalJamKerja  int    `json:"total_jam_kerja"`
}
