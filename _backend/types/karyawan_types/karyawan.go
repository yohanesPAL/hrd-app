package karywantypes

type KaryawanRes struct {
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
