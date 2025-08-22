$sourceFolder = "C:\Users\seungmkim\Desktop\MobileInvitation\img"
$thumbFolder = "C:\Users\seungmkim\Desktop\MobileInvitation\img\thumbs"
$maxSize = 400

if (!(Test-Path $thumbFolder)) {
    New-Item -ItemType Directory -Path $thumbFolder | Out-Null
}

Add-Type -AssemblyName System.Drawing

$extensions = @(".jpg", ".jpeg", ".png")

# EXIF Orientation 값에 따라 회전 함수
function Fix-ImageRotation([System.Drawing.Image]$image) {
    $orientationId = 0x0112  # Orientation EXIF ID

    foreach ($prop in $image.PropertyItems) {
        if ($prop.Id -eq $orientationId) {
            $orientation = [System.BitConverter]::ToUInt16($prop.Value, 0)

            switch ($orientation) {
                2 { $image.RotateFlip("RotateNoneFlipX") }       # Mirror horizontal
                3 { $image.RotateFlip("Rotate180FlipNone") }      # Rotate 180
                4 { $image.RotateFlip("Rotate180FlipX") }         # Mirror vertical
                5 { $image.RotateFlip("Rotate90FlipX") }          # Mirror horizontal + rotate 270 CW
                6 { $image.RotateFlip("Rotate90FlipNone") }       # Rotate 90 CW
                7 { $image.RotateFlip("Rotate270FlipX") }         # Mirror horizontal + rotate 90 CW
                8 { $image.RotateFlip("Rotate270FlipNone") }      # Rotate 270 CW
            }

            break
        }
    }

    return $image
}

Get-ChildItem $sourceFolder | Where-Object {
    $extensions -contains $_.Extension.ToLower()
} | ForEach-Object {
    $img = [System.Drawing.Image]::FromFile($_.FullName)

    # 회전 보정
    Fix-ImageRotation -image $img | Out-Null

    $w = $img.Width
    $h = $img.Height

    if ($w -ge $h) {
        $newW = $maxSize
        $newH = [int]($h * $maxSize / $w)
    } else {
        $newH = $maxSize
        $newW = [int]($w * $maxSize / $h)
    }

    $thumb = New-Object System.Drawing.Bitmap $newW, $newH
    $graphics = [System.Drawing.Graphics]::FromImage($thumb)
    $graphics.InterpolationMode = "HighQualityBicubic"
    $graphics.DrawImage($img, 0, 0, $newW, $newH)

    $destPath = Join-Path $thumbFolder $_.Name
    $thumb.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)

    $graphics.Dispose()
    $img.Dispose()
    $thumb.Dispose()
}