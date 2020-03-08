###
	Yield application
	Autor: Tsvikevich Denis 2020
###

#: import flexibel.coffee

runApplication = () ->
	evalPotentialYield()

fail = (error) ->
	htmlset "errorlogs", """<p style="color: red;">#{error}</p>"""
	off

clearError = () ->
	fail ""

evalPotentialYield = () ->
	par = runParser valueof "par"
	coeffpar = runParser valueof "coeff-par"
	cval = runParser valueof "cval"
	wetbase = runParser valueof "wetbase"
	partadd = runParser valueof "partadd"


	py = (par * coeffpar) / (1000 * cval)
	pybase = (py * 100) / ((100 - wetbase) * (1 + partadd))
	pyadd = pybase * partadd

	htmlset "result", "ПУ = #{py}<br>ПУ<sub>осн</sub> = #{pybase}<br>ПУ<sub>поб</sub> = #{pyadd}"

element "runButton"
	.addEventListener("click", runApplication)