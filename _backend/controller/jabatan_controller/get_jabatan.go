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

	rows, err := db.Query(`SELECT id, id_divisi, nama, is_active FROM jabatan`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal ambil data jabatan: %s", err)})
		return
	}
	defer rows.Close()

	data := []jabatantypes.JabatanRes{}
	for rows.Next() {
		var item jabatantypes.JabatanRes
		if err := rows.Scan(&item.Id, &item.IdDivisi, &item.Nama, &item.IsActive); err != nil {
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
