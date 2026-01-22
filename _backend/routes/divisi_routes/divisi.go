package divisiroutes

import (
	divisicontroller "hrsys/controller/divisi_controller"

	"github.com/gin-gonic/gin"
)

func Divisi(r *gin.Engine) {
	r.GET("/divisi", divisicontroller.GetDivisi)
	r.POST("/divisi", divisicontroller.PostDivisi)
	r.PATCH("/divisi", divisicontroller.PatchDivisi)
}
