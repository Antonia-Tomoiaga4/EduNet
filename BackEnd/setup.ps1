# Setup script for EduNet Backend

$MysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"

# Check if MySQL is installed
if (-not (Test-Path $MysqlPath)) {
    Write-Host "MySQL not found. Please install MySQL first." -ForegroundColor Red
    exit 1
}

Write-Host "Creating EduNet database..." -ForegroundColor Green

# Create database
$sql = @"
CREATE DATABASE IF NOT EXISTS edunet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE edunet;
"@

# Execute SQL
$MysqlPath -u root -p -e "$sql"

Write-Host "Database created successfully!" -ForegroundColor Green

# Build and run
Write-Host "Building Maven project..." -ForegroundColor Green
mvn clean install

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful! Starting application..." -ForegroundColor Green
    mvn spring-boot:run
} else {
    Write-Host "Build failed!" -ForegroundColor Red
}
