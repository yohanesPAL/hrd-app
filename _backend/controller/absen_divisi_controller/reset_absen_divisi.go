package absendivisicontroller

import (
	"fmt"
	"hrsys/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ResetAbsenDivisi(c *gin.Context) {
	id := c.Param("id")

	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id tidak boleh kosong"})
		return
	}

	db := models.DB

	tx, err := db.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal memulai transaksi: %s", err)})
		return
	}
	defer tx.Rollback()

	if _, err := tx.Exec(`UPDATE jam_absensi SET masuk = DEFAULT, keluar = DEFAULT, keluar_sabtu = DEFAULT WHERE id = ?`, id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal reset jam absen: %s", err)})
		return
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal commit: %s", err)})
		return
	}

	c.JSON(http.StatusOK, "success")
}
