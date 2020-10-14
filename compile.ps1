<#
	Compile script
	Usage: powershell -File compile.ps1

	Warning: with cyrillic symbols use in Windows 1251 encoding
	Autor: Tsvikevich Denis-2019
#>

# Path to project
$projectPath = "C:\Users\Admin\Documents\plantpro.github.io"
# Output path
$libPath = "C:\\Users\\Admin\\Documents\\plantpro.github.io\\scripts\\lib"
# Input path
$srcPath = "C:\\Users\\Admin\\Documents\\plantpro.github.io\\scripts\\src"

$stylesPath = "C:\\Users\\Admin\\Documents\\plantpro.github.io\\stylesheets\\"

# Apply CoffeScript compiler
coffee -c -o $libPath $srcPath
sass --watch $stylesPath
postcss stylesheets/book.css -u autoprefixer -d stylesheets