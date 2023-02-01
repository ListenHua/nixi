function className(menu, page, name) {
	let obj = {
		class: "",
		zIndex: 30,
	}
	if (menu) {
		if (page.main == name) {
			obj.class = 'scale-page'
			obj.zIndex = 50
		} else if (page.minor == name) {
			obj.class = 'scale-page-minor'
			obj.zIndex = 40
		} else {
			obj.class = 'hide-page'
		}
	} else {
		if (page.main == name) {
			obj.class = ''
			obj.zIndex = 50
		} else if (page.minor == name) {
			obj.class = ''
			obj.zIndex = 40
		} else {
			obj.class = 'hide-page'
		}
	}
	return obj
}

export {
	className
}
