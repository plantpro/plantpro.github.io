initializeReader = (pageCount, getPage) ->
		PAGE_CONTENT = document.getElementById("plpro-reader")
		PAGE_CONTENT.innerHTML = """
				<button id="plpro-reader-prev-btn" class="mdl-button mdl-button--disabled">&larr;</button>
				<input id="plpro-reader-page-tb" value="1" type="text"> /
				<span id="plpro-reader-pages-count"></span>
				<button id="plpro-reader-next-btn" class="mdl-button">&rarr;</button>
				<div id="plpro-reader-window"></div>
		"""
		READER_WINDOW = document.getElementById("plpro-reader-window")
		CURRENT_PAGE_TB = document.getElementById("plpro-reader-page-tb")

		currentPageNumber = 1

		isValidPage = (pageNumber) ->
			pageNumber >= 1 && pageNumber <= pageCount

		showPage = (pageNumber) ->
			if (isValidPage(pageNumber))
				if (pageNumber == 1)
					document.getElementById("plpro-reader-prev-btn").classList.add("mdl-button--disabled")
				else
					document.getElementById("plpro-reader-prev-btn").classList.remove("mdl-button--disabled")

				if (pageNumber == pageCount)
					document.getElementById("plpro-reader-next-btn").classList.add("mdl-button--disabled")
				else
					document.getElementById("plpro-reader-next-btn").classList.remove("mdl-button--disabled")

				READER_WINDOW.innerHTML = getPage pageNumber
				CURRENT_PAGE_TB.value = pageNumber

		next = () ->
			if (isValidPage(currentPageNumber + 1))
				currentPageNumber = currentPageNumber + 1
				showPage(currentPageNumber)

		prev = () ->
			if (isValidPage(currentPageNumber - 1))
				currentPageNumber = currentPageNumber - 1
				showPage(currentPageNumber)

		checkforenter = (e) ->
			if (e.keyCode == 13)
				requiredPageNumber = Number.parseInt(CURRENT_PAGE_TB.value)
				if (isValidPage(requiredPageNumber))
					currentPageNumber = requiredPageNumber
					showPage(currentPageNumber)

		initialX = null
		initialY = null

		startTouch = (e) ->
			initialX = e.touches[0].clientX
			initialY = e.touches[0].clientY

		moveTouch = (e) ->
			if (initialX == null)
				return
			if (initialY == null)
				return
			currentX = e.touches[0].clientX
			currentY = e.touches[0].clientY
			diffX = initialX - currentX
			diffY = initialY - currentY
			if (Math.abs(diffX) > Math.abs(diffY))
				if (diffX > 0)
					prev()
				else
					next()
				e.preventDefault()
		initialX = null
		initialY = null

		PAGE_CONTENT.addEventListener("touchstart", startTouch, false)
		PAGE_CONTENT.addEventListener("touchmove", moveTouch, false)
		document.getElementById("plpro-reader-pages-count").innerText = pageCount
		document.getElementById("plpro-reader-prev-btn").addEventListener("click", prev)
		document.getElementById("plpro-reader-next-btn").addEventListener("click", next)
		CURRENT_PAGE_TB.addEventListener("keydown", checkforenter)

		{
			READER_WINDOW,
			CURRENT_PAGE_TB,
			isValidPage,
			showPage,
			next,
			prev
		}

document.plpro = {
	reader: {
		initializeReader,
		tracing: {
			incrementalSvg: (dir) -> (pageNumber) -> "<img src='#{dir}/#{pageNumber}.svg'/>",
			incrementalSvgPrefix: (dir, prefix) -> (pageNumber) -> "<img src='#{dir}/#{prefix}#{pageNumber}.svg'/>",

			incrementalJpg: (dir) -> (pageNumber) -> "<img src='#{dir}/#{pageNumber}.jpg'/>",
			incrementalJpgPrefix: (dir, prefix) -> (pageNumber) -> "<img src='#{dir}/#{prefix}#{pageNumber}.jpg'/>",
		}
	}
}