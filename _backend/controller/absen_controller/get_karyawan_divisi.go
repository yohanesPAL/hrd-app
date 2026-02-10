package absencontroller

import (
	"database/sql"
	"fmt"
	"hrsys/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetKaryawanDivisi(c *gin.Context) {
	kodeAbsen := c.Param("absen")

	db := models.DB

	var kodeDiv string
	if err := db.QueryRow(`SELECT divisi FROM karyawan WHERE kode_absensi = ?`, kodeAbsen).Scan(&kodeDiv); err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "karyawwan dengan kode absen tersesbut tidak ditemukan"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal cek kode divisi karyawan: %s", err)})
		return
	}

	c.JSON(http.StatusOK, kodeDiv)
}
