package acaracontroller

import (
	"fmt"
	"hrsys/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func DeleteAcara(c *gin.Context) {
	id := c.Param("id")
	akunId := c.Query("aid")

	if id == "" || id == "undefined" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id tidak boleh kosong"})
		return
	}

	db := models.DB

	var userAcara string
	if err := db.QueryRow(`SELECT akun_id FROM acara WHERE id = ?`, id).Scan(&userAcara); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal cek user: %s", err)})
		return
	}

	if userAcara != akunId {
		c.JSON(http.StatusForbidden, gin.H{"error": fmt.Sprintf("acara milik user lain useracara: %s akunId: %s", userAcara, akunId)})
		return
	}

	tx, err := db.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal memulai transaksi: %s", err)})
		return
	}
	defer tx.Rollback()

	if _, err := tx.Exec(`DELETE FROM acara WHERE id = ?`, id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal hapus acara: %s", err)})
		return
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal commit: %s", err)})
		return
	}

	c.JSON(http.StatusOK, "success")
}
