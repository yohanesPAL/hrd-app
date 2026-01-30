package acararoutes

import (
	acaracontroller "hrsys/controller/acara_controller"

	"github.com/gin-gonic/gin"
)

func Acara(r *gin.Engine) {
	r.GET("/acara", acaracontroller.GetAcara)
	r.POST("/acara", acaracontroller.PostAcara)
	r.PATCH("/acara/:id", acaracontroller.PatchAcara)
	r.DELETE("/acara/:id", acaracontroller.DeleteAcara)
	r.GET("/acara/upcoming", acaracontroller.GetAcaraDashboard)
}
