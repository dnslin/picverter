package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"image"
	"image/gif"
	"image/jpeg"
	"image/png"
	"os"
	"path/filepath"
	"strings"

	"github.com/disintegration/imaging"
	"golang.org/x/image/bmp"
)

// App struct
type App struct {
	ctx context.Context
}

// CropArea defines the crop area coordinates
type CropArea struct {
	X      int `json:"x"`
	Y      int `json:"y"`
	Width  int `json:"width"`
	Height int `json:"height"`
}

// ProcessOptions defines image processing options
type ProcessOptions struct {
	Format  string    `json:"format"`  // "jpeg", "png", "webp", "gif", "bmp"
	Quality int       `json:"quality"` // 1-100 for JPEG/WebP
	Crop    *CropArea `json:"crop"`    // Optional crop area
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// ProcessImage processes an image with the given options
func (a *App) ProcessImage(imagePath string, options ProcessOptions) (string, error) {
	// Open the source image
	src, err := imaging.Open(imagePath)
	if err != nil {
		return "", fmt.Errorf("failed to open image: %v", err)
	}

	// Apply crop if specified
	if options.Crop != nil {
		crop := options.Crop
		src = imaging.Crop(src, image.Rect(crop.X, crop.Y, crop.X+crop.Width, crop.Y+crop.Height))
	}

	// Generate output filename
	dir := filepath.Dir(imagePath)
	ext := filepath.Ext(imagePath)
	name := strings.TrimSuffix(filepath.Base(imagePath), ext)
	outputPath := filepath.Join(dir, fmt.Sprintf("%s_processed.%s", name, options.Format))

	// Save with the specified format and quality
	err = a.saveImage(src, outputPath, options.Format, options.Quality)
	if err != nil {
		return "", fmt.Errorf("failed to save image: %v", err)
	}

	return outputPath, nil
}

// ProcessImageFromBase64 processes a base64 encoded image
func (a *App) ProcessImageFromBase64(base64Data string, options ProcessOptions) (string, error) {
	// Decode base64 data
	data, err := base64.StdEncoding.DecodeString(base64Data)
	if err != nil {
		return "", fmt.Errorf("failed to decode base64: %v", err)
	}

	// Create temporary file
	tempFile, err := os.CreateTemp("", "picverter_*.tmp")
	if err != nil {
		return "", fmt.Errorf("failed to create temp file: %v", err)
	}
	defer os.Remove(tempFile.Name())

	// Write data to temp file
	if _, err := tempFile.Write(data); err != nil {
		return "", fmt.Errorf("failed to write temp file: %v", err)
	}
	tempFile.Close()

	// Process the temp file
	return a.ProcessImage(tempFile.Name(), options)
}

// saveImage saves an image with the specified format and quality
func (a *App) saveImage(img image.Image, path string, format string, quality int) error {
	// Create output file
	out, err := os.Create(path)
	if err != nil {
		return err
	}
	defer out.Close()

	// Save based on format
	switch strings.ToLower(format) {
	case "jpeg", "jpg":
		if quality < 1 || quality > 100 {
			quality = 90
		}
		return jpeg.Encode(out, img, &jpeg.Options{Quality: quality})
	case "png":
		return png.Encode(out, img)
	case "gif":
		return gif.Encode(out, img, nil)
	case "bmp":
		return bmp.Encode(out, img)
	default:
		return fmt.Errorf("unsupported format: %s", format)
	}
}

// GetSupportedFormats returns list of supported image formats
func (a *App) GetSupportedFormats() []string {
	return []string{"jpeg", "png", "gif", "bmp"}
}
