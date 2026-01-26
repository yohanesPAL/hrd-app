package karywantypes

type KaryawanRes struct {
	Urutan         int    `json:"urutan"`
	Id             string `json:"id"`
	Nama           string `json:"nama"`
	JK             string `json:"jk"`
	Alamat         string `json:"alamat"`
	HP             string `json:"hp"`
	Divisi         string `json:"divisi"`
	Jabatan        string `json:"jabatan"`
	StatusAktif    string `json:"status_aktif"`
	StatusKaryawan string `json:"status_karyawan"`
}

type PostKaryawanReq struct {
	Nik            string `json:"nik"`
	Nama           string `json:"nama"`
	Alamat         string `json:"alamat"`
	JK             string `json:"jk"`
	HP             string `json:"hp"`
	Divisi         string `json:"divisi"`
	Jabatan        string `json:"jabatan"`
	CutiTerakhir   int    `json:"cuti_terakhir"`
	CutiSekarang   int    `json:"cuti_sekarang"`
	StatusAktif    bool   `json:"status_aktif"`
	StatusKaryawan string `json:"status_karyawan"`
	TglMasuk       string `json:"tgl_masuk"`
	DurasiKontrak  int    `json:"durasi_kontrak"`
	KodeAbsensi    string `json:"kode_absesnsi"`
}
