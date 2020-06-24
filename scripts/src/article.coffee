onCloseClick = () ->
	window.history.go(-1)
	false

onScrollTopClick = () ->
	document.body.scrollTop = 0 # For Safari
	document.documentElement.scrollTop = 0 # For Chrome, Firefox, IE and Opera

$ "close-btn"
.onClick onCloseClick

$ "scrollTop-btn"
.onClick onScrollTopClick