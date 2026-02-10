package absencontroller

import (
	"fmt"
	"hrsys/models"
	absentypes "hrsys/types/absen_types"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func createNamaArgs(data []absentypes.PostAbsenReq) ([]any, []string) {
	seen := make(map[string]struct{})
	args := []any{}
	placeholder := []string{}

	for _, item := range data {
		if _, exists := seen[item.AbsenId]; !exists {
			seen[item.AbsenId] = struct{}{}
			args = append(args, item.AbsenId)
			placeholder = append(placeholder, "?")
		}
	}

	return args, placeholder
}

func createAbsenArgs(data []absentypes.PostAbsenReq, karyawan map[string]string) ([]any, []string, error) {
	placeholder := []string{}
	args := []any{}

	for _, item := range data {
		nama, exist := karyawan[item.AbsenId]
		if !exist {
			return args, placeholder, fmt.Errorf("kode absen %s belum terdaftar", item.AbsenId)
		}

		args = append(args, item.AbsenId, nama, item.NamaAbsen, item.DivisiId, item.Tanggal, item.Absent, item.ScanMasuk, item.ScanKeluar, item.Terlambat, item.Lembur, item.JamKerja)
		placeholder = append(placeholder, "(?,?,?,?,?,?,?,?,?,?,?)")
	}

	return args, placeholder, nil
}

func PostAbsen(c *gin.Context) {
	req := []absentypes.PostAbsenReq{}
	if err := c.ShouldBindBodyWithJSON(&req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("invalid request body: %s", err)})
		return
	}

	if len(req) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "absen tidak boleh kosong"})
		return
	}

	db := models.DB

	namaArgs, namaPlaceholder := createNamaArgs(req)
	namaKaryawanQuery := fmt.Sprintf(`SELECT kode_absensi, nama FROM karyawan WHERE kode_absensi IN (%s)`, strings.Join(namaPlaceholder, ","))
	rows, err := db.Query(namaKaryawanQuery, namaArgs...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal ambil nama karyawan: %s", err)})
		return
	}
	defer rows.Close()

	namaKaryawanMap := make(map[string]string)
	for rows.Next() {
		var absenId, nama string
		if err := rows.Scan(&absenId, &nama); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal baca nama karyawan: %s", err)})
			return
		}
		namaKaryawanMap[absenId] = nama
	}

	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("iterasi nama karyawan: %s", err)})
		return
	}

	absenArgs, absenPlaceholder, err := createAbsenArgs(req, namaKaryawanMap)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	query := fmt.Sprintf(`INSERT INTO absen
		(kode_absen, nama_karyawan, nama_absen, divisi, tanggal, absent, scan_masuk, scan_keluar, terlambat, lembur, jam_kerja)
		VALUES %s`, strings.Join(absenPlaceholder, ","))

	tx, err := db.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal memulai transaksi: %s", err)})
		return
	}
	defer tx.Rollback()

	if _, err := tx.Exec(query, absenArgs...); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal menambah absen: %s", err)})
		return
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal commit: %s", err)})
		return
	}

	c.JSON(http.StatusOK, "success")
}
