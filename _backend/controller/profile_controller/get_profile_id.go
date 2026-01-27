package profilecontroller

import (
	"database/sql"
	"fmt"
	"hrsys/models"
	profiletypes "hrsys/types/profile_types"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetProfileId(c *gin.Context) {
	id := c.Param("id")

	db := models.DB

	var data profiletypes.ProfileRes
	var hp, tglMasuk, tglKeluar, durasiKontrak, kodeAbsensi sql.NullString
	if err := db.QueryRow(`SELECT nik, k.nama, jk, alamat, hp, d.nama, j.nama, sp, cuti_terakhir, cuti_sekarang, status_aktif, status_karyawan, tgl_masuk, tgl_keluar, durasi_kontrak, kode_absensi
		FROM karyawan AS k
		JOIN divisi AS d ON (d.id = k.divisi)
		JOIN jabatan AS j ON (j.id = k.jabatan)
		WHERE k.id = ?`, id).Scan(
		&data.NIK,
		&data.Nama,
		&data.JK,
		&data.Alamat,
		&hp,
		&data.Divisi,
		&data.Jabatan,
		&data.SP,
		&data.CutiTerakhir,
		&data.CutiSekarang,
		&data.StatusAktif,
		&data.StatusKaryawan,
		&tglMasuk,
		&tglKeluar,
		&durasiKontrak,
		&kodeAbsensi,
	); err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "profile tidak ditemukan"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal ambil profile: %s", err)})
		return
	}

	data.HP = hp.String
	data.TglMasuk = tglMasuk.String
	data.TglKeluar = tglKeluar.String
	data.DurasiKontrak = durasiKontrak.String
	data.KodeAbsensi = kodeAbsensi.String

	c.JSON(http.StatusOK, data)
}
