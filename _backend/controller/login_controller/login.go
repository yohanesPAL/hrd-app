package logincontroller

import (
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
	if err := db.QueryRow("SELECT username, role, karyawan_id FROM akun WHERE username = ? AND password = ?", req.Username, req.Password).Scan(&data.Username, &data.Role, &data.KaryawanId); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal login: %s", err)})
		return
	}

	c.JSON(http.StatusOK, data)
}

func GetAkun(c *gin.Context) {
	db := models.DB

	rows, err := db.Query("SELECT username, role, karyawan_id FROM akun")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal ambil data akun: %s", err)})
		return
	}
	defer rows.Close()

	data := []logintypes.LoginRes{}
	for rows.Next() {
		var item logintypes.LoginRes
		if err := rows.Scan(&item.Username, &item.Role, &item.KaryawanId); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal baca data akun: %s", err)})
			return
		}

		data = append(data, item)
	}

	c.JSON(http.StatusOK, data)
}
