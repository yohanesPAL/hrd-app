package jabatancontroller

import (
	"fmt"
	"hrsys/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func DeleteJabatan(c *gin.Context) {
	id := c.Param("id")

	if id == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "id tidak boleh kosong"})
		return
	}

	db := models.DB

	var isJabatanUsed bool
	if err := db.QueryRow(`SELECT EXISTS(SELECT 1 FROM karyawan WHERE jabatan = ?)`, id).Scan(&isJabatanUsed); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal cek jabatan: %s", err)})
		return
	}

	if isJabatanUsed {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "jabatan sudah dipakai karyawan"})
		return
	}

	tx, err := db.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal memulai transaksi: %s", err)})
		return
	}
	defer tx.Rollback()

	if _, err := tx.Exec(`DELETE FROM jabatan WHERE id = ?`, id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal hapus jabatan: %s", err)})
		return
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal commit: %s", err)})
		return
	}

	c.JSON(http.StatusOK, "success")
}
