# Upload all project files to GitHub using gh api
$ErrorActionPreference = "Stop"
$repo = "nareshsadha916/portfolio"
$basePath = "c:\Users\Admin\Downloads\protfolio"

# Refresh PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Collect all files to upload (exclude node_modules, .env, dist, uploads, .git)
$excludeDirs = @("node_modules", "dist", ".git", "uploads")
$excludeFiles = @(".env")

function Get-FilesToUpload($dir, $relativePath = "") {
    $files = @()
    foreach ($item in Get-ChildItem -Path $dir -Force) {
        $relPath = if ($relativePath) { "$relativePath/$($item.Name)" } else { $item.Name }
        
        if ($item.PSIsContainer) {
            $skip = $false
            foreach ($ex in $excludeDirs) {
                if ($item.Name -eq $ex) { $skip = $true; break }
            }
            if (-not $skip) {
                $files += Get-FilesToUpload $item.FullName $relPath
            }
        } else {
            $skip = $false
            foreach ($ex in $excludeFiles) {
                if ($item.Name -eq $ex) { $skip = $true; break }
            }
            if (-not $skip) {
                $files += @{ Path = $relPath; FullPath = $item.FullName }
            }
        }
    }
    return $files
}

Write-Host "Collecting files..."
$allFiles = Get-FilesToUpload $basePath
Write-Host "Found $($allFiles.Count) files to upload"

# Step 1: Create blobs for each file
$treeEntries = @()
$count = 0
foreach ($file in $allFiles) {
    $count++
    Write-Host "[$count/$($allFiles.Count)] Uploading: $($file.Path)"
    
    # Read file as base64
    $bytes = [System.IO.File]::ReadAllBytes($file.FullPath)
    $base64 = [System.Convert]::ToBase64String($bytes)
    
    # Create blob
    $blobJson = @{
        content = $base64
        encoding = "base64"
    } | ConvertTo-Json
    
    $blob = $blobJson | gh api "repos/$repo/git/blobs" --input - | ConvertFrom-Json
    
    $treeEntries += @{
        path = $file.Path
        mode = "100644"
        type = "blob"
        sha = $blob.sha
    }
}

Write-Host "`nCreating tree..."
$treeJson = @{
    tree = $treeEntries
} | ConvertTo-Json -Depth 5

$tree = $treeJson | gh api "repos/$repo/git/trees" --input - | ConvertFrom-Json
Write-Host "Tree created: $($tree.sha)"

# Step 2: Get current commit SHA
$ref = gh api "repos/$repo/git/ref/heads/main" | ConvertFrom-Json
$parentSha = $ref.object.sha
Write-Host "Parent commit: $parentSha"

# Step 3: Create commit
$commitJson = @{
    message = "Add portfolio project files (frontend + backend)"
    tree = $tree.sha
    parents = @($parentSha)
} | ConvertTo-Json -Depth 3

$commit = $commitJson | gh api "repos/$repo/git/commits" --input - | ConvertFrom-Json
Write-Host "Commit created: $($commit.sha)"

# Step 4: Update branch to point to new commit
$updateRef = @{
    sha = $commit.sha
    force = $true
} | ConvertTo-Json

$updateRef | gh api "repos/$repo/git/refs/heads/main" --method PATCH --input - | Out-Null
Write-Host "`n✅ All files pushed to GitHub successfully!"
Write-Host "View your repo: https://github.com/$repo"
