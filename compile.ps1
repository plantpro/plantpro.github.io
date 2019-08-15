<#
	CoffeeScript compilation file
	Usage: powershell -File compile.ps1

	Warning: with cyrillic symbols use in Windows 1251 encoding
	Autor: Tsvikevich Denis-2019
#>

# Output path
$libPath = "C:\\Users\\ÔÍ\\Desktop\\—œ·√¿”\\plantprotection\\scripts\\lib"
# Input path
$srcPath = "C:\\Users\\ÔÍ\\Desktop\\—œ·√¿”\\plantprotection\\scripts\\src"

# Apply CoffeScript compiler
coffee -c -o $libPath $srcPath