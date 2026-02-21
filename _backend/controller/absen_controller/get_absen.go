package absencontroller

import (
	"fmt"
	"hrsys/models"
	absentypes "hrsys/types/absen_types"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAbsen(c *gin.Context) {
	db := models.DB

	rows, err := db.Query(`SELECT kode_absen, nama_karyawan, d.nama, COUNT(absent), SUM(terlambat), SUM(lembur), SUM(jam_kerja)
		FROM absen JOIN divisi d ON (d.id = absen.divisi) GROUP BY kode_absen`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal ambil absen: %s", err)})
		return
	}
	defer rows.Close()

	data := []absentypes.GetAbsenRes{}
	for rows.Next() {
		var item absentypes.GetAbsenRes
		if err := rows.Scan(&item.AbsenId, &item.Nama, &item.Divisi, &item.JumlahAbsen, &item.TotalTerlambat, &item.TotalLembur, &item.TotalJamKerja); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal baca absen: %s", err)})
			return
		}

		data = append(data, item)
	}

	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("iterasi absen: %s", err)})
		return
	}

	c.JSON(http.StatusOK, "success")
}
