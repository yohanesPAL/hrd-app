package jabatanroutes

import (
	jabatancontroller "hrsys/controller/jabatan_controller"

	"github.com/gin-gonic/gin"
)

func Jabatan(r *gin.Engine) {
	r.GET("/jabatan", jabatancontroller.GetJabatan)
	r.POST("/jabatan", jabatancontroller.PostJabatan)
	r.PATCH("/jabatan", jabatancontroller.PatchJabatan)
}
