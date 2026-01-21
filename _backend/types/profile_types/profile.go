package profiletypes

type ProfileRes struct {
	NIK            string `json:"nik"`
	Nama           string `json:"nama"`
	JK             string `json:"jk"`
	Alamat         string `json:"alamat"`
	HP             string `json:"hp"`
	Divisi         string `json:"divisi"`
	Jabatan        string `json:"jabatan"`
	SP             string `json:"sp"`
	CutiTerakhir   string `json:"cuti_terakhir"`
	CutiSekarang   string `json:"cuti_sekarang"`
	StatusAktif    string `json:"status_aktif"`
	StatusKaryawan string `json:"status_karyawan"`
	TglMasuk       string `json:"tgl_masuk"`
	TglKeluar      string `json:"tgl_keluar"`
	DurasiKontrak  string `json:"durasi_kontrak"`
	KodeAbsensi    string `json:"kode_absensi"`
}
