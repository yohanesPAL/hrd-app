package divisicontroller

import (
	"fmt"
	"hrsys/models"
	divisitypes "hrsys/types/divisi_types"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetDivisi(c *gin.Context) {
	db := models.DB

	rows, err := db.Query(`SELECT id, nama, is_active FROM divisi`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal ambil data divisi: %s", err)})
		return
	}
	defer rows.Close()

	data := []divisitypes.DivisiRes{}
	for rows.Next() {
		var item divisitypes.DivisiRes
		if err := rows.Scan(&item.Id, &item.Nama, &item.IsActive); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal baca data divisi: %s", err)})
			return
		}

		data = append(data, item)
	}

	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("iterasi data divisi: %s", err)})
		return
	}

	c.JSON(http.StatusOK, data)
}
