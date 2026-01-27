package karyawancontroller

import (
	"fmt"
	"hrsys/models"
	karywantypes "hrsys/types/karyawan_types"
	"net/http"

	"github.com/gin-gonic/gin"
)

func PatchKodeAbsesnsi(c *gin.Context) {
	var req karywantypes.PatchKodeAbsesnsiReq
	if err := c.ShouldBindBodyWithJSON(&req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("invalid request body: %s", err)})
		return
	}

	db := models.DB

	tx, err := db.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal memulai transaksi: %s", err)})
		return
	}
	defer tx.Rollback()

	if _, err := tx.Exec(`UPDATE karyawan SET kode_absensi = ? WHERE id = ?`, req.KodeAbsensi, req.Id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal update kode absensi: %s", err)})
		return
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal commit: %s", err)})
		return
	}

	c.JSON(http.StatusOK, "success")
}
