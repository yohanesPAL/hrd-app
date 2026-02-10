package acaracontroller

import (
	"fmt"
	"hrsys/models"
	acaratypes "hrsys/types/acara_types"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func GetAcaraDashboard(c *gin.Context) {
	userId := c.Query("user_id")

	db := models.DB

	today := time.Now().Format("2006-01-02")

	rows, err := db.Query(`SELECT title, start, end FROM acara WHERE akun_id = ? AND end >= ? ORDER BY end ASC LIMIT 6`, userId, today)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal ambil acara: %s", err)})
		return
	}
	defer rows.Close()

	data := []acaratypes.GetAcaraDashBoardRes{}
	for rows.Next() {
		var item acaratypes.GetAcaraDashBoardRes
		if err := rows.Scan(&item.Title, &item.Start, &item.End); err != nil {
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
