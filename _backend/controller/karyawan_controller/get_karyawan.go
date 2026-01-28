package karyawancontroller

import (
	"database/sql"
	"fmt"
	"hrsys/models"
	karyawantypes "hrsys/types/karyawan_types"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetKaryawan(c *gin.Context) {
	db := models.DB

	rows, err := db.Query(`SELECT k.id, k.nama, jk, alamat, hp, d.nama, j.nama, status_aktif, status_karyawan, kode_absensi, sp FROM karyawan AS k
		JOIN divisi AS d ON (d.id = k.divisi)
		JOIN jabatan AS j ON (j.id = k.jabatan)`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal ambil data karyawan: %s", err)})
		return
	}
	defer rows.Close()

	data := []karyawantypes.KaryawanRes{}
	urutan := 1
	for rows.Next() {
		var item karyawantypes.KaryawanRes
		var hp sql.NullString
		if err := rows.Scan(&item.Id, &item.Nama, &item.JK, &item.Alamat, &hp, &item.Divisi, &item.Jabatan, &item.StatusAktif, &item.StatusKaryawan, &item.KodeAbsensi, &item.Sp); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal baca data karyawan: %s", err)})
			return
		}
		item.HP = hp.String
		item.Urutan = urutan
		urutan++

		data = append(data, item)
	}

	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("iterasi data karyawan: %s", err)})
		return
	}

	c.JSON(http.StatusOK, data)
}
