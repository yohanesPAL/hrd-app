package karyawancontroller

import (
	"fmt"
	"hrsys/models"
	divisitypes "hrsys/types/divisi_types"
	jabatantypes "hrsys/types/jabatan_types"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetFormDepedencies(c *gin.Context) {
	db := models.DB

	rows, err := db.Query(`SELECT id, nama FROM divisi WHERE is_active = 1`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal ambil divisi: %s", err)})
		return
	}
	defer rows.Close()

	divisi := []divisitypes.PatchDivisiReq{}
	for rows.Next() {
		var item divisitypes.PatchDivisiReq
		if err := rows.Scan(&item.Id, &item.Nama); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal baca divisi: %s", err)})
			return
		}
		item.IsActive = true

		divisi = append(divisi, item)
	}

	rows, err = db.Query(`SELECT id, id_divisi, nama FROM jabatan WHERE is_active = 1`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal ambil jabatan: %s", err)})
		return
	}
	defer rows.Close()

	jabatan := []jabatantypes.PatchJabatanReq{}
	for rows.Next() {
		var item jabatantypes.PatchJabatanReq
		if err := rows.Scan(&item.Id, &item.IdDivisi, &item.Nama); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal baca jabatan: %s", err)})
			return
		}
		item.IsActive = true

		jabatan = append(jabatan, item)
	}

	c.JSON(http.StatusOK, gin.H{
		"divisi":  divisi,
		"jabatan": jabatan,
	})
}
