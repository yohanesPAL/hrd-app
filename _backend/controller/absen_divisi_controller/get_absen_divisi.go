package absendivisicontroller

import (
	"fmt"
	"hrsys/models"
	absendivisitypes "hrsys/types/absen_divisi_types"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAbsenDivisi(c *gin.Context) {
	db := models.DB

	rows, err := db.Query(`SELECT divisi, masuk, keluar, keluar_sabtu FROM jam_absensi`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal ambil jam absen: %s", err)})
		return
	}
	defer rows.Scan()

	data := []absendivisitypes.GetAbsenDivisiRes{}
	for rows.Next() {
		var item absendivisitypes.GetAbsenDivisiRes
		if err := rows.Scan(&item.KodeDiv, &item.Masuk, &item.Keluar, &item.KeluarSabtu); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal baca jam absen: %s", err)})
			return
		}

		data = append(data, item)
	}

	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("iterasi jam absen: %s", err)})
		return
	}

	c.JSON(http.StatusOK, data)
}

func parseMinutesToClock(timeInMinutes int) string {
	hours := timeInMinutes / 60
	minutes := timeInMinutes % 60

	return fmt.Sprintf("%02d:%02d", hours, minutes)
}

func GetAbsenDivisiForTable(c *gin.Context) {
	db := models.DB

	rows, err := db.Query(`SELECT ja.id, ja.divisi, d.nama, masuk, keluar, keluar_sabtu
		FROM jam_absensi ja JOIN divisi d ON (d.id = ja.divisi)`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal ambil jam absensi: %s", err)})
		return
	}
	defer rows.Close()

	data := []absendivisitypes.GetAbsenDivisiTableRes{}
	urutan := 1
	for rows.Next() {
		var item absendivisitypes.GetAbsenDivisiTableRes
		var masuk, keluar, keluarSabtu int
		if err := rows.Scan(&item.Id, &item.KodeDiv, &item.NamaDiv, &masuk, &keluar, &keluarSabtu); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal baca jam absensi: %s", err)})
			return
		}

		item.Masuk = parseMinutesToClock(masuk)
		item.Keluar = parseMinutesToClock(keluar)
		item.KeluarSabtu = parseMinutesToClock(keluarSabtu)
		item.Urutan = urutan
		urutan++

		data = append(data, item)
	}

	c.JSON(http.StatusOK, data)
}
