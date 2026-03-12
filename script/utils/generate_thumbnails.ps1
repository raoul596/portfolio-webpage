param(
    [string]$SourceRoot = "images",
    [string]$ThumbRoot = "images/thumbs",
    [int]$MaxWidth = 720,
    [int]$JpegQuality = 72
)

Add-Type -AssemblyName System.Drawing

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Split-Path -Parent (Split-Path -Parent $scriptRoot)

if (-not [System.IO.Path]::IsPathRooted($SourceRoot)) {
    $SourceRoot = Join-Path $repoRoot $SourceRoot
}

if (-not [System.IO.Path]::IsPathRooted($ThumbRoot)) {
    $ThumbRoot = Join-Path $repoRoot $ThumbRoot
}

if (!(Test-Path $SourceRoot)) {
    throw "Source folder '$SourceRoot' does not exist."
}

if (!(Test-Path $ThumbRoot)) {
    New-Item -ItemType Directory -Path $ThumbRoot | Out-Null
}

$supported = @(".jpg", ".jpeg", ".png")
$sourceRootResolved = (Resolve-Path $SourceRoot).Path
$thumbRootResolved = (Resolve-Path $ThumbRoot).Path

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageDecoders() |
    Where-Object { $_.FormatID -eq [System.Drawing.Imaging.ImageFormat]::Jpeg.Guid }

$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
    [System.Drawing.Imaging.Encoder]::Quality,
    [long]$JpegQuality
)

Get-ChildItem -Path $sourceRootResolved -Recurse -File | ForEach-Object {
    $ext = $_.Extension.ToLowerInvariant()
    if ($supported -notcontains $ext) {
        return
    }

    if ($_.FullName.StartsWith($thumbRootResolved, [System.StringComparison]::OrdinalIgnoreCase)) {
        return
    }

    $relativePath = $_.FullName.Substring($sourceRootResolved.Length).TrimStart('\', '/')
    $destPath = Join-Path $thumbRootResolved $relativePath
    $destDir = Split-Path $destPath -Parent

    if (!(Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    }

    $srcImage = $null
    $dstBitmap = $null
    $graphics = $null

    try {
        $srcImage = [System.Drawing.Image]::FromFile($_.FullName)

        $targetWidth = [Math]::Min($MaxWidth, $srcImage.Width)
        $targetHeight = [int][Math]::Round($srcImage.Height * ($targetWidth / [double]$srcImage.Width))

        $dstBitmap = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight)
        $graphics = [System.Drawing.Graphics]::FromImage($dstBitmap)
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.DrawImage($srcImage, 0, 0, $targetWidth, $targetHeight)

        if ($ext -eq ".jpg" -or $ext -eq ".jpeg") {
            $dstBitmap.Save($destPath, $jpegCodec, $encoderParams)
        } else {
            $dstBitmap.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
        }

        Write-Host "Thumbnail created: $destPath"
    }
    finally {
        if ($graphics) { $graphics.Dispose() }
        if ($dstBitmap) { $dstBitmap.Dispose() }
        if ($srcImage) { $srcImage.Dispose() }
    }
}
