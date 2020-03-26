initializeReader = (pageCount, getPage) ->
		READER_WINDOW = document.getElementById("plpro-reader-window")
		CURRENT_PAGE_TB = document.getElementById("plpro-reader-page-tb")

		currentPageNumber = 1

		isValidPage = (pageNumber) ->
			pageNumber >= 1 && pageNumber <= PAGE_COUNT

		showPage = (pageNumber) ->
			if (isValidPage(pageNumber))
				if (pageNumber == 1)
					document.getElementById("plpro-reader-prev-btn").classList.add("mdl-button--disabled")
				else
					document.getElementById("plpro-reader-prev-btn").classList.remove("mdl-button--disabled")

				if (pageNumber == PAGE_COUNT)
					document.getElementById("plpro-reader-next-btn").classList.add("mdl-button--disabled")
				else
					document.getElementById("plpro-reader-next-btn").classList.remove("mdl-button--disabled")

				READER_WINDOW.innerHTML = """<img src="#{getPage(pageNumber)}"/>"""
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
