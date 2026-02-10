package absenroutes

import (
	absencontroller "hrsys/controller/absen_controller"

	"github.com/gin-gonic/gin"
)

func Absen(r *gin.Engine) {
	r.GET("/absen/karyawan/:absen", absencontroller.GetKaryawanDivisi)
	r.POST("/absen", absencontroller.PostAbsen)
	r.DELETE("/absen/truncate", absencontroller.TruncateAbsen)
}
