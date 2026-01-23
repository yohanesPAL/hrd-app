package jabatancontroller

import (
	"fmt"
	"hrsys/models"
	jabatantypes "hrsys/types/jabatan_types"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetJabatan(c *gin.Context) {
	db := models.DB

	rows, err := db.Query(`SELECT j.id, divisi.id, divisi.nama, j.nama, j.is_active
		FROM jabatan AS j JOIN divisi ON (divisi.id = j.id_divisi)`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal ambil data jabatan: %s", err)})
		return
	}
	defer rows.Close()

	data := []jabatantypes.JabatanRes{}
	for rows.Next() {
		var item jabatantypes.JabatanRes
		if err := rows.Scan(&item.Id, &item.IdDivisi, &item.NamaDiv, &item.Nama, &item.IsActive); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal baca data jabatan: %s", err)})
			return
		}

		data = append(data, item)
	}

	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("iterasi data jabatan: %s", err)})
		return
	}

	c.JSON(http.StatusOK, data)
}
