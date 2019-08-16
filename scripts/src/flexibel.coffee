# Operator function for '-'
export sub = (x, y) -> x - y

# Operator function for '+', also allow to sum of array
export sum = (x, y) ->
	return x.reduce sum unless y?
	x + y

# Operator function for '*', also allow to mul of array
export mul = (x, y) ->
	return x.reduce mul unless y?
	x * y

# Operator function for '/'
export div = (x, y) -> x / y

# Returns the min of two elements, or min of array
export min = (x, y) ->
	return x.reduce min unless y?
	if x < y then x else y

# Returns the max of two elements, or max of array
export max = (x, y) ->
	return x.reduce max unless y?
	if x > y then x else y

export last = (container) ->
	container[container.length - 1]

export first = (container) ->
	container[0]

export element = (id) ->
	document.getElementById id
	
export valueset = (id, value) ->
	element(id).value = value

export valueof = (id) ->
	element(id).value

export checkedof = (id) ->
	element(id).checked

export htmlset = (id, html) ->
	element(id).innerHTML = html

export ejoin = (values) ->
	values.join ""

export del = (str, sym) ->
	str.replace(new Regex(sym, "g"), "")

export delws = (str, sym) ->
	str.replace(/\w+/, "")

export values = (map) ->
	[map.values()...]
export keys = (map) ->
	[map.values()...]
export maxKey = (map) ->
	keys(map).reduce max
export maxValue = (map) ->
	values(map).reduce max
export countIt = (map, it) ->
	if map.has it
		map.set it, map.get(it) + 1
	else
		map.set it, 1
export makeValueCells = (map) ->
	"<td>#{v}</td>" for v from map.values()
export makeKeyCells = (map) ->
	"<td>#{k}</td>" for k from map.keys()