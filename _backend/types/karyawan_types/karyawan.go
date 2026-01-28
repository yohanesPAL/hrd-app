package karyawantypes

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
	KodeAbsensi    string `json:"kode_absensi"`
	Sp             int    `json:"sp"`
}

type PostKaryawanReq struct {
	Nik            string `json:"nik" binding:"required"`
	Nama           string `json:"nama" binding:"required"`
	Alamat         string `json:"alamat" binding:"required"`
	JK             string `json:"jk" binding:"required"`
	HP             string `json:"hp"`
	Divisi         string `json:"divisi" binding:"required"`
	Jabatan        string `json:"jabatan" binding:"required"`
	CutiTerakhir   int    `json:"cuti_terakhir"`
	CutiSekarang   int    `json:"cuti_sekarang"`
	StatusAktif    bool   `json:"status_aktif"`
	StatusKaryawan string `json:"status_karyawan" binding:"required"`
	TglMasuk       string `json:"tgl_masuk" binding:"required"`
	DurasiKontrak  int    `json:"durasi_kontrak"`
	KodeAbsensi    string `json:"kode_absensi"`
}

type PatchKodeAbsesnsiReq struct {
	Id          string `json:"id" binding:"required"`
	KodeAbsensi string `json:"kode_absensi" binding:"required"`
}

type PatchSpReq struct {
	Id string `json:"id" binding:"required"`
	Sp int    `json:"sp" binding:"required"`
}

type PatchKaryawanDataRes struct {
	Nik            string `json:"nik"`
	Nama           string `json:"nama"`
	JK             string `json:"jk"`
	Alamat         string `json:"alamat"`
	HP             string `json:"hp"`
	Divisi         string `json:"divisi"`
	Jabatan        string `json:"jabatan"`
	CutiTerakhir   string `json:"cuti_terakhir"`
	CutiSekarang   string `json:"cuti_sekarang"`
	StatusAktif    string `json:"status_aktif"`
	StatusKaryawan string `json:"status_karyawan"`
	TglMasuk       string `json:"tgl_masuk"`
	TglKeluar      string `json:"tgl_keluar"`
	DuraiKontrak   string `json:"durasi_kontrak"`
}

type PatchKaryawanReq struct {
	Id             string `json:"id" binding:"required"`
	Nik            string `json:"nik" binding:"required"`
	Nama           string `json:"nama" binding:"required"`
	JK             string `json:"jk" binding:"required"`
	Alamat         string `json:"alamat" binding:"required"`
	HP             string `json:"hp"`
	Divisi         string `json:"divisi" binding:"required"`
	Jabatan        string `json:"jabatan" binding:"required"`
	CutiTerakhir   string `json:"cuti_terakhir"`
	CutiSekarang   string `json:"cuti_sekarang"`
	StatusAktif    string `json:"status_aktif"`
	StatusKaryawan string `json:"status_karyawan" binding:"required"`
	TglMasuk       string `json:"tgl_masuk" binding:"required"`
	TglKeluar      string `json:"tgl_keluar"`
	DuraiKontrak   string `json:"durasi_kontrak"`
}
