package acaracontroller

import (
	"fmt"
	"hrsys/models"
	acaratypes "hrsys/types/acara_types"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func GetAcara(c *gin.Context) {
	tglMulai := c.Query("tm")
	tglAkhir := c.Query("ta")
	userId := c.Param("userId")

	start, err := time.Parse(time.RFC3339, tglMulai)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("invalid date: %s", err)})
		return
	}

	end, err := time.Parse(time.RFC3339, tglAkhir)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("invalid date: %s", err)})
		return
	}

	db := models.DB

	rows, err := db.Query(`SELECT id, title, start, end FROM acara WHERE akun_id = ? AND start < ? AND end > ?`, userId, end, start)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal ambil acara: %s", err)})
		return
	}
	defer rows.Close()

	data := []acaratypes.GetAcaraRes{}
	for rows.Next() {
		var item acaratypes.GetAcaraRes
		if err := rows.Scan(&item.Id, &item.Title, &item.Start, &item.End); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal baca acara: %s", err)})
			return
		}

		data = append(data, item)
	}

	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("iterasi acara: %s", err)})
		return
	}

	c.JSON(http.StatusOK, data)
}
