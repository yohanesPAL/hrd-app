package profileroutes

import (
	profilecontroller "hrsys/controller/profile_controller"

	"github.com/gin-gonic/gin"
)

func Profile(r *gin.Engine) {
	r.GET("/profile/:id", profilecontroller.GetProfileId)
}
