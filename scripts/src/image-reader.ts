function createInterface(root: HTMLElement) {
	let prevButton = document.createElement("button");
	prevButton.innerHTML = "&larr;";
	root.appendChild(prevButton);

	let input = document.createElement("input");
	input.type = "text";
	input.value = "1";
	root.appendChild(input);

	let nextButton = document.createElement("button");
	nextButton.innerHTML = "&rarr;";
	root.appendChild(nextButton);

	let readerWindow = document.createElement("div");
	root.appendChild(readerWindow);

	return {
		prevButton,
		nextButton,
		input,
		readerWindow
	};
}

function initializeReader(pageCount: number, getPage) {
	const { prevButton, nextButton, input, readerWindow } =
		createInterface(document.getElementById("plpro-reader"));

	let currentPageNumber = 1;

	function isValidPage(pageNumber: number): boolean {
		return pageNumber >= 1 && pageNumber <= pageCount
	}

	function showPage(pageNumber: number) {
		if (isValidPage(pageNumber)) {
			if (pageNumber == 1)
				prevButton.classList.add("disabled")
			else
				prevButton.classList.remove("disabled")

			if (pageNumber == pageCount)
				nextButton.classList.add("disabled")
			else
				nextButton.classList.remove("disabled")

			readerWindow.innerHTML = getPage(pageNumber);
			input.value = pageNumber.toString();
		}
	}

	function next() {
		if (isValidPage(currentPageNumber + 1)) {
			currentPageNumber = currentPageNumber + 1
			showPage(currentPageNumber)
		}
	}

	function prev() {
		if (isValidPage(currentPageNumber - 1)) {
			currentPageNumber = currentPageNumber - 1
			showPage(currentPageNumber)
		}
	}

	function checkforenter(e: KeyboardEvent) {
		if (e.code === "Enter") {
			let requiredPageNumber = Number.parseInt(input.value)
			if (isValidPage(requiredPageNumber)) {
				currentPageNumber = requiredPageNumber
				showPage(currentPageNumber)
			}
		}
	}

	function registerSwipe(element: HTMLElement) {
		let initialX = null;
		let initialY = null

		function startTouch(e: TouchEvent) {
			initialX = e.touches[0].clientX;
			initialY = e.touches[0].clientY;
		}

		function moveTouch(e: TouchEvent) {
			if (initialX == null || initialY == null) {
				return;
			}

			let currentX = e.touches[0].clientX;
			let currentY = e.touches[0].clientY;

			let diffX = initialX - currentX;
			let diffY = initialY - currentY;

			if (Math.abs(diffX) > Math.abs(diffY)) {
				if (diffX < 0) {
					prev();
				} else {
					next();
				}

				e.preventDefault();
			}

			initialX = null;
			initialY = null;
		}

		element.addEventListener("touchstart", startTouch, false);
		element.addEventListener("touchmove", moveTouch, false);
	}

	registerSwipe(document.getElementById("plpro-reader"));

	//document.getElementById("plpro-reader-pages-count").innerText = pageCount;
	prevButton.addEventListener("click", prev);
	nextButton.addEventListener("click", next);
	input.addEventListener("keydown", checkforenter);

	return {
		readerWindow,
		input,
		isValidPage,
		showPage,
		next,
		prev
	}
}

document["plpro"] = {
	reader: {
		initializeReader,
		tracing: {
			incrementalSvg:
				(dir: string) =>
					(pageNumber: number) => `<img src='${dir}/${pageNumber}.svg'/>`,
			incrementalSvgPrefix:
				(dir: string, prefix: string) =>
					(pageNumber: number) => `<img src='${dir}/${prefix}${pageNumber}.svg'/>`,

			incrementalJpg:
				(dir: string) =>
					(pageNumber: number) => `<img src='${dir}/${pageNumber}.jpg'/>`,
			incrementalJpgPrefix:
				(dir: string, prefix: string) =>
					(pageNumber: number) => `<img src='${dir}/${prefix}${pageNumber}.jpg'/>`,
		}
	}
}