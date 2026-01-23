package divisicontroller

import (
	"fmt"
	"hrsys/models"
	divisitypes "hrsys/types/divisi_types"
	"net/http"

	"github.com/gin-gonic/gin"
)

func PostDivisi(c *gin.Context) {
	var req divisitypes.PostDivisiReq
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

	if _, err := tx.Exec(`INSERT INTO divisi (nama, is_active) VALUES (?,?)`, req.Nama, req.IsActive); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal menambah divisi: %s", err)})
		return
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal commit: %s", err)})
		return
	}

	c.JSON(http.StatusCreated, "success")
}
