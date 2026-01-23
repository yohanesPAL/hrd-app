package jabatanroutes

import (
	jabatancontroller "hrsys/controller/jabatan_controller"

	"github.com/gin-gonic/gin"
)

func Jabatan(r *gin.Engine) {
	r.GET("/jabatan", jabatancontroller.GetJabatan)
	r.GET("/jabatan/divisi", jabatancontroller.GetDivisi)
	r.POST("/jabatan", jabatancontroller.PostJabatan)
	r.PATCH("/jabatan/:id", jabatancontroller.PatchJabatan)
	r.DELETE("/jabatan/:id", jabatancontroller.DeleteJabatan)
}
