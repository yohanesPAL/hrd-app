package absendivisiroutes

import (
	absendivisicontroller "hrsys/controller/absen_divisi_controller"

	"github.com/gin-gonic/gin"
)

func AbsenDivisi(r *gin.Engine) {
	r.GET("/absen-divisi", absendivisicontroller.GetAbsenDivisi)
	r.GET("/absen-divisi/table", absendivisicontroller.GetAbsenDivisiForTable)
	r.PATCH("/absen-divisi/:id", absendivisicontroller.PatchAbsenDivisi)
	r.PATCH("/absen-divisi/:id/reset", absendivisicontroller.ResetAbsenDivisi)

}
