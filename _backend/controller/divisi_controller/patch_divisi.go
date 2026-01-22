package divisicontroller

import (
	"fmt"
	"hrsys/models"
	divisitypes "hrsys/types/divisi_types"
	"net/http"

	"github.com/gin-gonic/gin"
)

func PatchDivisi(c *gin.Context) {
	var req divisitypes.PatchDivisiReq
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

	if _, err := tx.Exec("UPDATE divisi SET nama = ?, is_active = ? WHERE id = ?", req.Nama, req.IsActive, req.Id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal update divisi: %s", err)})
		return
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal commit: %s", err)})
		return
	}

	c.JSON(http.StatusOK, "success")
}
