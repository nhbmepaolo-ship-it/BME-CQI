Add-Type -AssemblyName System.Drawing

function Upscale-Image {
    param(
        [string]$srcPath,
        [string]$dstPath,
        [int]$targetWidth,
        [int]$targetHeight
    )

    Write-Host "Reading image $srcPath..."
    $src = [System.Drawing.Image]::FromFile($srcPath)
    
    $tmpPath = $dstPath + ".tmp.jpg"
    $bmp = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight)
    $g = [System.Drawing.Graphics]::FromImage($bmp)

    # Maximum High Quality Interpolation & Sharpening Settings
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $g.DrawImage($src, 0, 0, $targetWidth, $targetHeight)
    
    $g.Dispose()
    $src.Dispose()

    # Save at 95% JPEG quality
    $encoder = [System.Drawing.Imaging.Encoder]::Quality
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, [long]95)
    
    $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }

    $bmp.Save($tmpPath, $jpegCodec, $encoderParams)
    $bmp.Dispose()

    Move-Item -Force $tmpPath $dstPath
    Write-Host "Upscaled $dstPath to $targetWidth x $targetHeight crisp A4 resolution."
}

$root = $PSScriptRoot
Upscale-Image (Join-Path $root "assets\page1_template.jpg") (Join-Path $root "assets\page1_template.jpg") 2480 3508
Upscale-Image (Join-Path $root "assets\page2_template.jpg") (Join-Path $root "assets\page2_template.jpg") 2480 3508
