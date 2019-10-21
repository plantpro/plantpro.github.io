<#
	Publish script
	Usage: powershell -File publish.ps1

	Warning: with cyrillic symbols use in Windows 1251 encoding
	Autor: Tsvikevich Denis-2019
#>

# Path to project
$projectPath = "C:\\Users\\��\\Desktop\\������\\plantprotection"
# Path to Babel (installed globally)
$babelPath = "C:\\Users\\��\\AppData\\Roaming\\npm\\node_modules\\@babel"
# Output path
$libPath = "C:\\Users\\��\\Desktop\\������\\plantprotection\\scripts\\lib"
# Input path
$srcPath = "C:\\Users\\��\\Desktop\\������\\plantprotection\\scripts\\src"
# Temporary directory with concatenated files
$srcctPath = "C:\\Users\\��\\Desktop\\������\\plantprotection\\scripts\\src\\srcct"

# Concat files
py concater.py $srcPath $srcctPath

# Apply CoffeScript compiler
coffee -c -o $libPath $srcctPath

# Apply Babel
set-location $babelPath
babel $libPath --out-dir $libPath --presets=@babel/env
set-location $projectPath

# Apply UglifyJS
foreach ($script in get-childitem $libPath -file | where-object { -not $_.basename.endswith(".min" ) }) {
	uglifyjs $script.fullname -o ($libPath + "\\" + $script.basename + ".min.js")
}

py .\dictionary\generator\make_dict.py .\dictionary\generator\src.txt .\dictionary\
py .\library\generator\make_lib.py .\library\index.html

# Publish at GitHub
git add *
git commit -m automessage
git pull origin master 
git push origin master
