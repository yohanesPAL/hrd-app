package acaracontroller

import (
	"fmt"
	"hrsys/models"
	acaratypes "hrsys/types/acara_types"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func PostAcara(c *gin.Context) {
	var req acaratypes.PostAcaraReq
	if err := c.ShouldBindBodyWithJSON(&req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("invalid request body: %s", err)})
		return
	}

	start, err := time.Parse(time.RFC3339, req.Start)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("invalid date: %s", err)})
		return
	}

	end, err := time.Parse(time.RFC3339, req.End)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("invalid date: %s", err)})
		return
	}

	db := models.DB

	tx, err := db.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal memulai transaksi: %s", err)})
		return
	}
	defer tx.Rollback()

	if _, err := tx.Exec(`INSERT INTO acara (akun_id, title, start, end) VALUES (?,?,?,?)`, req.AkunId, req.Title, start, end); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal menambah acara: %s", err)})
		return
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal commit: %s", err)})
		return
	}

	c.JSON(http.StatusOK, "success")
}
