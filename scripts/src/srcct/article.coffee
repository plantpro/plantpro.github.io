onCloseClick = () ->
	window.history.go(-1)
	false

onScrollTopClick = () ->
	document.body.scrollTop = 0 # For Safari
	document.documentElement.scrollTop = 0 # For Chrome, Firefox, IE and Opera

document.getElementById "close-btn"
.addEventListener "click", onCloseClick

document.getElementById "scrollTop-btn"
.addEventListener "click", onScrollTopClick