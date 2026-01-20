package logintypes

type LoginReq struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginRes struct {
	Id         string `json:"id"`
	Username   string `json:"username"`
	Role       string `json:"role"`
	KaryawanId string `json:"karyawan_id"`
}
