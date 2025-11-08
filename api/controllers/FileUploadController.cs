using Microsoft.AspNetCore.Mvc;
using System.IO;
using mutuelleApi.dtos;

namespace mutuelleApi.controllers
{
    public class FileUploadController(IWebHostEnvironment webHost) : BaseController
    {
        private readonly IWebHostEnvironment _env = webHost;


        [HttpPost]
        public IActionResult UploadImage(UploadImage request)
        {
            if (string.IsNullOrEmpty(request.Image) || string.IsNullOrEmpty(request.Extension))
            {
                return BadRequest("Invalid image data or filename.");
            }

            try
            {
                // Remove "data:image/png;base64," prefix if present
                string base64Data = request.Image.Split(',')[1];
                byte[] imageBytes = Convert.FromBase64String(base64Data);

                // Save the image to a desired location (e.g., wwwroot/uploads)
                string uploadsFolder = Path.Combine(_env.WebRootPath,"uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }
                string fileName = Guid.NewGuid().ToString() + '.' + request.Extension;
                string filePath = Path.Combine(uploadsFolder, fileName);
                System.IO.File.WriteAllBytes(filePath, imageBytes);

                return Ok(new { FileName = fileName, Message = "Image uploaded successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
