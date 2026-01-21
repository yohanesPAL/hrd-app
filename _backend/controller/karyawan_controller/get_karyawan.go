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

	rows, err := db.Query(`SELECT id, nama, jk, alamat, hp, divisi, jabatan, status_aktif, status_karyawan FROM karyawan`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal ambil data karyawan: %s", err)})
		return
	}
	defer rows.Close()

	data := []karyawantypes.KaryawanRes{}
	for rows.Next() {
		var item karyawantypes.KaryawanRes
		var hp sql.NullString
		if err := rows.Scan(&item.Id, &item.Nama, &item.JK, &item.Alamat, &hp, &item.Divisi, &item.Jabatan, &item.StatusAktif, &item.StatusKaryawan); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal baca data karyawan: %s", err)})
			return
		}
		item.HP = hp.String

		data = append(data, item)
	}

	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("iterasi data karyawan: %s", err)})
		return
	}

	c.JSON(http.StatusOK, data)
}
