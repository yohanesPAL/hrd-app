package karyawanroutes

import (
	karyawancontroller "hrsys/controller/karyawan_controller"

	"github.com/gin-gonic/gin"
)

func Karyawan(r *gin.Engine) {
	r.GET("/karyawan", karyawancontroller.GetKaryawan)
	r.POST("/karyawan", karyawancontroller.PostKaryawan)
	r.GET("/karyawan/form-depedencies", karyawancontroller.GetFormDepedencies)
}
