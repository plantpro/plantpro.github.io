<#
	Publish debug script
	Usage: powershell -File pubdb.ps1
#>

# Apply CoffeScript compiler
coffee -c -o scripts/ scripts/src