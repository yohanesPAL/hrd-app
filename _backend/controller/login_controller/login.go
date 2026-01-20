package logincontroller

import (
	"database/sql"
	"fmt"
	"hrsys/models"
	logintypes "hrsys/types/login_types"
	"net/http"

	"github.com/gin-gonic/gin"
)

func LoginHandler(c *gin.Context) {
	var req logintypes.LoginReq
	if err := c.ShouldBindBodyWithJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("invalid request body: %s", err)})
		return
	}

	db := models.DB

	var data logintypes.LoginRes
	if err := db.QueryRow("SELECT id, username, role, karyawan_id FROM akun WHERE username = ? AND password = ?", req.Username, req.Password).Scan(&data.Id, &data.Username, &data.Role, &data.KaryawanId); err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "username / password salah"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal login: %s", err)})
		return
	}

	c.JSON(http.StatusOK, data)
}
