package absencontroller

import (
	"fmt"
	"hrsys/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func TruncateAbsen(c *gin.Context) {
	db := models.DB

	if _, err := db.Exec(`TRUNCATE absen`); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal truncate: %s", err)})
		return
	}

	c.JSON(http.StatusOK, "success")
}
