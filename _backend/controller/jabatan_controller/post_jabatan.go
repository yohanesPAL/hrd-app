package jabatancontroller

import (
	"fmt"
	"hrsys/models"
	divisitypes "hrsys/types/divisi_types"
	jabatantypes "hrsys/types/jabatan_types"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetDivisi(c *gin.Context) {
	db := models.DB

	rows, err := db.Query(`SELECT id, nama FROM divisi WHERE is_active = 1`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal ambil divisi: %s", err)})
		return
	}
	defer rows.Close()

	data := []divisitypes.DivisiRes{}
	for rows.Next() {
		var item divisitypes.DivisiRes
		if err := rows.Scan(&item.Id, &item.Nama); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal baca divisi: %s", err)})
			return
		}
		item.IsActive = true

		data = append(data, item)
	}

	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("iterasi divisi: %s", err)})
		return
	}

	c.JSON(http.StatusOK, data)
}

func PostJabatan(c *gin.Context) {
	var req jabatantypes.PostJabatanReq
	if err := c.ShouldBindBodyWithJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("invalid request body: %s", err)})
		return
	}

	db := models.DB

	tx, err := db.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal memulai transaksi: %s", err)})
		return
	}
	defer tx.Rollback()

	if _, err := tx.Exec(`INSERT INTO jabatan (id_divisi, nama, is_active) VALUES (?,?,?)`, req.IdDivisi, req.Nama, req.IsActive); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal menambah jabatan: %s", err)})
		return
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erorr": fmt.Sprintf("iterasi data jabatan: %s", err)})
		return
	}

	c.JSON(http.StatusAccepted, "success")
}
