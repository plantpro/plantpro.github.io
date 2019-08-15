<#
	Publish debug script
	Usage: powershell -File pubdb.ps1
#>

$libPath = "C:\\Users\\ÔÍ\\Desktop\\—œ·√¿”\\plantprotection\\scripts\\lib"
$srcPath = "C:\\Users\\ÔÍ\\Desktop\\—œ·√¿”\\plantprotection\\scripts\\src"

# Apply CoffeScript compiler
coffee -c -o $libPath $srcPath