# ============================================================
# CPI Form System Server (Static files + Documents REST API)
# Run: powershell -ExecutionPolicy Bypass -File start_server.ps1
# API:
#   GET    /api/documents        -> list all documents
#   GET    /api/documents?id=X   -> single document
#   POST   /api/documents        -> create/update (JSON body, upsert by id)
#   DELETE /api/documents?id=X   -> delete document
# Data stored as JSON files inside .\data\
# ============================================================

$port = 8080
$root = $PSScriptRoot
$dataDir = Join-Path $root "data"
if (-not (Test-Path -LiteralPath $dataDir)) {
    New-Item -ItemType Directory -Path $dataDir -Force | Out-Null
}

function Start-Listener($prefixList) {
    $l = New-Object System.Net.HttpListener
    foreach ($p in $prefixList) { [void]$l.Prefixes.Add($p) }
    $l.Start()
    return $l
}

$listener = $null
try {
    # Bind to all interfaces so other machines on the LAN/network can access.
    # If not permitted (needs admin or URL ACL), fall back to localhost only.
    $listener = Start-Listener @("http://+:$port/")
    Write-Host "=========================================================="
    Write-Host "🌐 Network mode: other computers can access via http://<IP-ของเครื่องนี้>:$port/"
    Write-Host "🚀 CPI Form System Server running:"
    Write-Host "   http://localhost:$port/"
    Write-Host "Press Ctrl+C in this terminal to stop the server."
    Write-Host "=========================================================="
} catch {
    try {
        $listener = Start-Listener @("http://localhost:$port/", "http://127.0.0.1:$port/")
        Write-Host "=========================================================="
        Write-Host "⚠️ เปิดให้เครื่องอื่นเข้าถึงไม่ได้ (ต้องรัน as Administrator) — เข้าถึงได้เฉพาะเครื่องนี้"
        Write-Host "🚀 CPI Form System Server running at: http://localhost:$port/"
        Write-Host "Press Ctrl+C in this terminal to stop the server."
        Write-Host "=========================================================="
    } catch {
        Write-Host "Listener start error: $_"
        exit 1
    }
}

Start-Process "http://localhost:$port/"

function Read-RequestText($req) {
    $reader = New-Object System.IO.StreamReader($req.InputStream, [System.Text.Encoding]::UTF8)
    try { return $reader.ReadToEnd() } finally { $reader.Close() }
}

function Send-Json($res, $statusCode, $obj) {
    $json = ConvertTo-Json -InputObject $obj -Depth 16 -Compress
    $buf = [System.Text.Encoding]::UTF8.GetBytes($json)
    $res.StatusCode = $statusCode
    $res.ContentType = "application/json; charset=utf-8"
    $res.ContentLength64 = $buf.Length
    $res.OutputStream.Write($buf, 0, $buf.Length)
}

function Test-DocId($id) {
    return ($id -match '^[A-Za-z0-9_\-]{3,80}$')
}

function New-DocId {
    return "doc_{0}_{1}" -f (Get-Date -Format "yyyyMMdd_HHmmss"), (Get-Random -Minimum 1000 -Maximum 9999)
}

function Get-IsoNow {
    return (Get-Date).ToUniversalTime().ToString("o")
}

while ($listener.IsListening) {
    try {
        $ctx = $listener.GetContext()
        $req = $ctx.Request
        $res = $ctx.Response

        # CORS headers (handy if frontend is hosted elsewhere)
        $res.AddHeader("Access-Control-Allow-Origin", "*")
        $res.AddHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        $res.AddHeader("Access-Control-Allow-Headers", "Content-Type")

        $urlPath = $req.Url.LocalPath
        $method = $req.HttpMethod

        # ---------- API ----------
        if ($urlPath -eq "/api/documents") {
            try {
                if ($method -eq "OPTIONS") {
                    $res.StatusCode = 204
                }
                elseif ($method -eq "GET") {
                    $id = $req.QueryString["id"]
                    if ($id) {
                        if (-not (Test-DocId $id)) { Send-Json $res 400 @{ ok = $false; error = "invalid id" } }
                        else {
                            $file = Join-Path $dataDir ($id + ".json")
                            if ([System.IO.File]::Exists($file)) {
                                $text = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)
                                $doc = ConvertFrom-Json $text
                                Send-Json $res 200 $doc
                            } else {
                                Send-Json $res 404 @{ ok = $false; error = "document not found" }
                            }
                        }
                    }
                    else {
                        $docs = @()
                        Get-ChildItem -LiteralPath $dataDir -Filter "*.json" -File | ForEach-Object {
                            try {
                                $text = [System.IO.File]::ReadAllText($_.FullName, [System.Text.Encoding]::UTF8)
                                $docs += ,(ConvertFrom-Json $text)
                            } catch { }
                        }
                        $sorted = @($docs | Sort-Object -Property updatedAt -Descending)
                        $json = ConvertTo-Json -InputObject $sorted -Depth 16 -Compress
                        $buf = [System.Text.Encoding]::UTF8.GetBytes($json)
                        $res.StatusCode = 200
                        $res.ContentType = "application/json; charset=utf-8"
                        $res.ContentLength64 = $buf.Length
                        $res.OutputStream.Write($buf, 0, $buf.Length)
                    }
                }
                elseif ($method -eq "POST") {
                    $bodyText = Read-RequestText $req
                    if ([string]::IsNullOrWhiteSpace($bodyText)) {
                        Send-Json $res 400 @{ ok = $false; error = "empty body" }
                    }
                    else {
                        $doc = ConvertFrom-Json $bodyText
                        $newId = $null
                        if (-not $doc.PSObject.Properties["id"] -or -not $doc.id) {
                            $newId = New-DocId
                        } elseif (-not (Test-DocId ([string]$doc.id))) {
                            $newId = New-DocId
                        }
                        if ($newId) {
                            $doc | Add-Member -NotePropertyName id -NotePropertyValue $newId -Force
                        }
                        if (-not $doc.PSObject.Properties["createdAt"] -or -not $doc.createdAt) {
                            $doc | Add-Member -NotePropertyName createdAt -NotePropertyValue (Get-IsoNow) -Force
                        }
                        $doc | Add-Member -NotePropertyName updatedAt -NotePropertyValue (Get-IsoNow) -Force

                        $file = Join-Path $dataDir (([string]$doc.id) + ".json")
                        $json = ConvertTo-Json -InputObject $doc -Depth 16
                        [System.IO.File]::WriteAllText($file, $json, (New-Object System.Text.UTF8Encoding($false)))
                        Send-Json $res 200 @{ ok = $true; id = [string]$doc.id; updatedAt = $doc.updatedAt }
                    }
                }
                elseif ($method -eq "DELETE") {
                    $id = $req.QueryString["id"]
                    if (-not $id -or -not (Test-DocId $id)) {
                        Send-Json $res 400 @{ ok = $false; error = "invalid id" }
                    } else {
                        $file = Join-Path $dataDir ($id + ".json")
                        if ([System.IO.File]::Exists($file)) {
                            [System.IO.File]::Delete($file)
                            Send-Json $res 200 @{ ok = $true }
                        } else {
                            Send-Json $res 404 @{ ok = $false; error = "document not found" }
                        }
                    }
                }
                else {
                    Send-Json $res 405 @{ ok = $false; error = "method not allowed" }
                }
            } catch {
                Send-Json $res 500 @{ ok = $false; error = "$_" }
            }
        }
        # ---------- Static files ----------
        else {
            if ($urlPath -eq "/") { $urlPath = "/index.html" }

            $relPath = $urlPath.TrimStart('/') -replace '/', '\'
            $filePath = [System.IO.Path]::Combine($root, $relPath)

            if ([System.IO.File]::Exists($filePath)) {
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                switch ($ext) {
                    ".html" { $res.ContentType = "text/html; charset=utf-8" }
                    ".css"  { $res.ContentType = "text/css; charset=utf-8" }
                    ".js"   { $res.ContentType = "application/javascript; charset=utf-8" }
                    ".jpg"  { $res.ContentType = "image/jpeg" }
                    ".jpeg" { $res.ContentType = "image/jpeg" }
                    ".png"  { $res.ContentType = "image/png" }
                    ".svg"  { $res.ContentType = "image/svg+xml" }
                    ".ico"  { $res.ContentType = "image/x-icon" }
                    ".json" { $res.ContentType = "application/json; charset=utf-8" }
                    default { $res.ContentType = "application/octet-stream" }
                }

                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $res.ContentLength64 = $bytes.Length
                $res.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $res.StatusCode = 404
                $buf = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                $res.OutputStream.Write($buf, 0, $buf.Length)
            }
        }
        $res.OutputStream.Close()
    } catch {
        # ignore request error
    }
}
