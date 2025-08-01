// Wails API bindings
// These will be available after building with Wails

declare global {
  interface Window {
    go: {
      main: {
        App: {
          ProcessImage: (
            imagePath: string,
            options: ProcessOptions
          ) => Promise<string>;
          ProcessImageFromBase64: (
            base64Data: string,
            options: ProcessOptions
          ) => Promise<string>;
          GetSupportedFormats: () => Promise<string[]>;
          Greet: (name: string) => Promise<string>;
        };
      };
    };
  }
}

export interface ProcessOptions {
  format: string;
  quality: number;
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Wrapper functions for Wails API
export const WailsAPI = {
  async processImage(
    imagePath: string,
    options: ProcessOptions
  ): Promise<string> {
    if (window.go?.main?.App?.ProcessImage) {
      return window.go.main.App.ProcessImage(imagePath, options);
    }
    throw new Error("Wails API not available");
  },

  async processImageFromBase64(
    base64Data: string,
    options: ProcessOptions
  ): Promise<string> {
    if (window.go?.main?.App?.ProcessImageFromBase64) {
      return window.go.main.App.ProcessImageFromBase64(base64Data, options);
    }
    throw new Error("Wails API not available");
  },

  async getSupportedFormats(): Promise<string[]> {
    if (window.go?.main?.App?.GetSupportedFormats) {
      return window.go.main.App.GetSupportedFormats();
    }

    return ["jpeg", "png", "gif", "bmp"];
  },

  async greet(name: string): Promise<string> {
    if (window.go?.main?.App?.Greet) {
      return window.go.main.App.Greet(name);
    }

    return `Hello ${name}!`;
  },
};

// Utility function to convert File to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = reader.result.split(",")[1];

        resolve(base64);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = error => reject(error);
  });
};
