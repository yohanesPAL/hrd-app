package absendivisicontroller

import (
	"fmt"
	"hrsys/models"
	absendivisitypes "hrsys/types/absen_divisi_types"
	"net/http"

	"github.com/gin-gonic/gin"
)

func PatchAbsenDivisi(c *gin.Context) {
	var req absendivisitypes.PatchAbsenDivisiReq
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

	if _, err := tx.Exec(`UPDATE jam_absensi SET masuk=?, keluar=?, keluar_sabtu=? WHERE id = ?`, req.Masuk, req.Keluar, req.KeluarSabtu, req.Id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal update jam absen: %s", err)})
		return
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal commit: %s", err)})
		return
	}

	c.JSON(http.StatusOK, "success")
}
