<#
	Publish script
	Usage: powershell -File publish.ps1

	Warning: with cyrillic symbols use in Windows 1251 encoding
	Autor: Tsvikevich Denis-2019
#>

# Path to project
$projectPath = "C:\Users\Admin\Documents\plantpro.github.io"
# Path to Babel (installed globally)
#$babelPath = "C:\\Users\\��\\AppData\\Roaming\\npm\\node_modules\\@babel"
# Output path
$libPath = "C:\\Users\\Admin\\Documents\\plantpro.github.io\\scripts\\lib"
# Input path
$srcPath = "C:\\Users\\Admin\\Documents\\plantpro.github.io\\scripts\\src"
# Temporary directory with concatenated files
$srcctPath = "C:\\Users\\Admin\\Documents\\plantpro.github.io\\scripts\\src\\srcct"

# Apply CoffeScript compiler
coffee -c -o $libPath $srcctPath

# Apply Babel
#set-location $babelPath
#babel $libPath --out-dir $libPath --presets=@babel/env
#set-location $projectPath

# Apply UglifyJS
#foreach ($script in get-childitem $libPath -file | where-object { -not $_.basename.endswith(".min" ) }) {
#	uglifyjs $script.fullname -o ($libPath + "\\" + $script.basename + ".min.js")
#}

# Publish at GitHub
git add *
git commit -m automessage
git pull origin master 
git push origin master
