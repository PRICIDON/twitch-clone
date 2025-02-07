export function getRandomColor() {
	let color = '#'
	const letters = '0123456789ABCDEF'
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * letters.length)]
	}
	return color
}
