package divisicontroller

import (
	"fmt"
	"hrsys/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func DeleteDivisi(c *gin.Context) {
	id := c.Param("id")

	if id == "" || id == "undefined" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "id tidak boleh kosong"})
		return
	}

	db := models.DB

	var isDivisiUsed bool
	if err := db.QueryRow(`SELECT EXISTS(SELECT 1 FROM jabatan WHERE id_divisi = ?)`, id).Scan(&isDivisiUsed); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal cek divisi: %s", err)})
		return
	}

	if isDivisiUsed {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "divisi sudah dipakai jabatan"})
		return
	}

	tx, err := db.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal memulai transaksi: %s", err)})
		return
	}
	defer tx.Rollback()

	if _, err := tx.Exec(`DELETE FROM divisi WHERE id = ?`, id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal hapus divisi: %s", err)})
		return
	}

	if _, err := tx.Exec(`DELETE FROM jam_absensi WHERE divisi = ?`, id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal hapus jam absen: %s", err)})
		return
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal commit: %s", err)})
		return
	}

	c.JSON(http.StatusOK, "success")
}
