HINTS = [
	["Знаете ли вы?",
	"""
		Рибосомы прокариот меньше рибосом эукариот и константа их седиментации равна 70S
	"""]
]

document.getHint = () ->
	hintNo = Math.floor(Math.random() * HINTS.length)
	hint = HINTS[hintNo]
	return "<h6>" + hint[0] + "</h6>" + hint[1]