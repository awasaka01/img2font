// https://unicode.org/Public/UNIDATA/UnicodeData.txt

let UNICODE_FULL_LIST = [];
const BLOCKS = [
	{ link: "https://www.compart.com/en/unicode/block/U+0000", ranges: [[0x0020, 0x007E]], name: "Basic Latin -m" },
	{ link: "https://www.compart.com/en/unicode/block/U+0080", ranges: [[0x0080, 0x00FF]], name: "Latin-1 Supplement" },
	{ link: "https://www.compart.com/en/unicode/block/U+2000", ranges: [[0x2010, 0x2027], [0x2030, 0x205E]], name: "General Punctuation -m" },
	{ link: "https://www.compart.com/en/unicode/block/U+2190", ranges: [[0x2190, 0x21FF]], name: "Arrows" },
	{ link: "https://www.compart.com/en/unicode/block/U+2200", ranges: [[0x2200, 0x22FF]], name: "Mathematical Operators" },
	{ link: "https://www.compart.com/en/unicode/block/U+2300", ranges: [[0x2300, 0x23FF]], name: "Miscellaneous Technical" },
	{ link: "https://www.compart.com/en/unicode/block/U+2500", ranges: [[0x2500, 0x257F]], name: "Box Drawing" },
	{ link: "https://www.compart.com/en/unicode/block/U+2580", ranges: [[0x2580, 0x259F]], name: "Block Elements" },
	{ link: "https://www.compart.com/en/unicode/block/U+25A0", ranges: [[0x25A0, 0x25FF]], name: "Geometric Shapes" },
	{ link: "https://www.compart.com/en/unicode/block/U+2600", ranges: [[0x2600, 0x26FF]], name: "Miscellaneous Symbols" },
	{ link: "https://www.compart.com/en/unicode/block/U+27F0", ranges: [[0x27F0, 0x27FF]], name: "Supplemental Arrows A" },
	{ link: "https://www.compart.com/en/unicode/block/U+2B00", ranges: [[0x2B00, 0x2BFF]], name: "Miscelennous Symbols and Arrows" },
	{ link: "https://www.compart.com/en/unicode/block/U+FFF0", ranges: [[0xFFF0, 0XFFFF]], name: "Specials" },
	{ link: "https://www.compart.com/en/unicode/block/U+FF00", ranges: [[0xFF01, 0xFFEE]], name: "Halfwidth and Fullwidth Forms" },
	{ link: "https://www.compart.com/en/unicode/block/U+FE50", ranges: [[0xFE50, 0xFE6F]], name: "Small Form Variants" },
	{ link: "https://www.compart.com/en/unicode/block/U+2654", ranges: [[0x2654, 0x265F]], name: "Chess Symbols -m" },
	{ link: "https://www.compart.com/en/unicode/block/U+1F800", ranges: [[0x1F800, 0x1F8FF]], name: "Supplemental Arrows C" },
	{ link: "https://www.compart.com/en/unicode/block/U+1F780", ranges: [[0x1F780, 0x1F7D8]], name: "Geometric Shapes Extended" },
	{ link: "https://www.compart.com/en/unicode/block/U+1F700", ranges: [[0x1F700, 0x1F77F]], name: "Alchemical Symbols" },
];

// default options
let user_options = {
	"character_width": 8,
	"character_height": 16,
	"gap_around": 1,
	"characters_per_row": 10,
	"border_color": "#b64b3d",
	"font": "GNU Unifont",
};

function formatFileName (name) {
	return name.replace(/\s+/g, "_").toLowerCase();
}



document.addEventListener("DOMContentLoaded", async () => {
	console.log("DOM loaded");

	// Load the unicode list
	const res = await fetch("./assets/unicode.txt");
	if (!res.ok) return alert("Catastrophic error!\n:(");
	const text = await res.text();
	UNICODE_FULL_LIST = text.split("\n").map((x) => x.split(";").slice(0, 2));

	// Setup live-updating options
	setupLiveUpdatingOptions();

	generateTemplateImages(); // temp
});







function setupLiveUpdatingOptions () {
	const root = document.querySelector(":root");

	// Font
	document.getElementById("font").addEventListener("input", (e) => { root.style.setProperty("--font", e.target.value); });
}


// Geneterate the template images, with corresponding character table
async function generateTemplateImages () {

	// Reset
	// user_options = getCurrentOptions();
	document.getElementById("templates").innerHTML = "";


	// Generate the data for each block, using current options
	const BLOCKS_LIST = await generateBaseData(BLOCKS);
	console.log(BLOCKS_LIST);





	const templatesContainer = document.getElementById("templates");
	BLOCKS_LIST.forEach((block) => {

	// -------------------------------------------------------------------------------------------------------------
	//	ANCHOR 	Generate the HTML for the current block
	// -------------------------------------------------------------------------------------------------------------

		const blockSection = document.createElement("div");
		blockSection.classList.add("template");
		blockSection.innerHTML = `
			<div class="character-table-title">U+${block.rangeStart} <b>${block.name}</b></div>
			<div class="character-table", style="grid-template-columns: repeat(${user_options.characters_per_row}, auto)"></div>

			<div class="download-link"><a download="${formatFileName(block.name)}.png">⤓ Click here to download image ⤓</a></div>
			<div class="layers"><div class="wrapper"><canvas class="fg" oncontextmenu="return false;"></canvas><canvas class="bg"></canvas></div></div>
			<div class="character-description">
					<span><p class="title">Name:</p><br></span>
					<p class="name" style="margin-bottom: auto">0</p>
					
					<p class="title">Position:</p>
					<p class="position">6</p>

					<p class="title">UTF code:</p>
					<p class="utf-code">1231</p>
			</div>`;
		templatesContainer.appendChild(blockSection);
		console.log(blockSection);

		// Setup the download link
		const download = blockSection.getElementsByClassName("download-link")[0].firstChild;
		download.onclick = (e) => e.target.href = fg.toDataURL("image/png");

		// Add cell to grid for each character
		const grid = blockSection.getElementsByClassName("character-table")[0];
		block.characters.forEach((char, i) => {
			const cell = document.createElement("div");
			cell.innerHTML = char.symbol;
			block.characters[i].element = cell;
			grid.appendChild(cell);
		});




	// -------------------------------------------------------------------------------------------------------------
	//	ANCHOR  Draw the image for the current block
	// -------------------------------------------------------------------------------------------------------------

		const fg = blockSection.getElementsByClassName("fg")[0];
		const bg = blockSection.getElementsByClassName("bg")[0];
		const ctx = fg.getContext("2d");

		// Calculate width and height of canvas
		const width = (user_options.character_width * user_options.characters_per_row) + (user_options.gap_around * (user_options.characters_per_row + 1));
		const height = (user_options.character_height * block.height) + (user_options.gap_around * (block.height + 1));
		fg.width = width; fg.height = height; bg.width = width; bg.height = height;

		// Fill the background with border color and then cut out the character boxes, for clean lines
		ctx.fillStyle = user_options.border_color;
		ctx.fillRect(0, 0, bg.width, bg.height);
		block.characters.forEach((char) => { ctx.clearRect(char.topLeft.x, char.topLeft.y, user_options.character_width, user_options.character_height); });




	// -------------------------------------------------------------------------------------------------------------
	//	ANCHOR  Register mouse events for the hover effects
	// -------------------------------------------------------------------------------------------------------------

		const info = {
			position: blockSection.getElementsByClassName("position")[0],
			utfCode: blockSection.getElementsByClassName("utf-code")[0],
			name: blockSection.getElementsByClassName("name")[0],
		};

		const ctxBG = bg.getContext("2d");
		ctxBG.fillStyle = "rgba(255, 255, 255, 1)";



		function activateCharacter (character) {

			block.activeCharacter = character;

			character.element.classList.add("active");
			ctxBG.clearRect(0, 0, bg.width, bg.height);
			ctxBG.fillRect(character.topLeft.x, character.topLeft.y, user_options.character_width, user_options.character_height);

			// Update text
			info.position.textContent = `(${character.row + 1}, ${character.col + 1})`;
			info.name.textContent = character.name;
			info.utfCode.innerHTML = "U+" + character.utfcode + "<br>";
		}

		function deactivateCharacter (character) {
			if (block.activeCharacter === character) block.activeCharacter = undefined;
			character.element.classList.remove("active");
			ctxBG.clearRect(0, 0, bg.width, bg.height);
		}

		// Activate character when hovering over the grid
		block.characters.forEach((char) => {
			char.element.addEventListener("mouseenter", () => activateCharacter(char, block, ctxBG));
			char.element.addEventListener("mouseleave", () => deactivateCharacter(char, block));
		});

		// Activate character when hovering over the canvas
		fg.addEventListener("mousemove", (e) => {

			// Get position of cursor
			const rect = e.target.getBoundingClientRect();
			const mouse = { x: Math.round(e.clientX - rect.left), y: Math.round(e.clientY - rect.top) };

			// Find block mouse is inside of
			const character = block.characters.find((char) => char.topLeft.x <= mouse.x && char.topLeft.y <= mouse.y && char.bottomRight.x >= mouse.x && char.bottomRight.y >= mouse.y);
			if (!character || character === block.activeCharacter) return;

			// Deactivate old character
			if (block.activeCharacter !== undefined) deactivateCharacter(block.activeCharacter);

			// Activate current character
			activateCharacter(character);
		});
		fg.addEventListener("mouseleave", () => deactivateCharacter(block.activeCharacter));



		// end
	});
}




// Generate the full data for each block
async function generateBaseData (BLOCKS_DATA_ENABLED) {

	return BLOCKS_DATA_ENABLED.map((obj) => {
		const { name, ranges, link } = obj;
		const block = {
			// Generated Here:
			name,
			link,
			characters: [],
			height: 0,
			rangeStart: ranges[0][0].toString(16).toUpperCase().padStart(4, "0"),

			// Extended Data:
			activeCharacter: undefined,
			elements: {
				fg: undefined,
				bg: undefined,
				grid: undefined,
				download: undefined,
				info: { position: undefined, utfCode: undefined, name: undefined },
			},
		};

		// Generate characters
		ranges.forEach(([start, end]) => {
			for (let i = start; i <= end; i++) {
				const obj = generateCharacterObjectFromUTFCode(i.toString(16).toUpperCase().padStart(4, "0"), i);
				if (obj !== undefined) block.characters.push(obj);
			}
		});
		block.height = Math.ceil(block.characters.length / user_options.characters_per_row);

		// Generate characters
		function generateCharacterObjectFromUTFCode (utfcode, utfcodeInDecimal) {

			// Some parts of the ranges listed are not valid glyphs, skip them
			const name = UNICODE_FULL_LIST.find((x) => x[0] === utfcode)?.[1]; // optional chaining: '?.'
			if (!name) return;

			// The shape of a character object
			const obj = {
				row: 0, col: 0,
				topLeft: { x: 0, y: 0 },
				bottomRight: { x: 0, y: 0 },
				element: undefined,

				utfcode: utfcode,
				name: name,
				symbol: String.fromCharCode(utfcodeInDecimal),
			};

			// Calculate which row and column the character will be in the grid
			const characterAmount = block.characters.length;
			obj.row = characterAmount % user_options.characters_per_row;
			obj.col = Math.floor(characterAmount / user_options.characters_per_row);

			// Calculate the actual pixel position of the character in the image
			obj.topLeft.x = (obj.row * user_options.character_width) + (user_options.gap_around * obj.row) + 1;
			obj.topLeft.y = (obj.col * user_options.character_height) + (user_options.gap_around * obj.col) + 1;
			obj.bottomRight.x = obj.topLeft.x + user_options.character_width;
			obj.bottomRight.y = obj.topLeft.y + user_options.character_height;

			return obj;
		}
		return block;
	});
}









function generateFontFromFiles (params) {

}

function updateTextDisplayForBlock (block, characterSelection) {

}

// Generate the config area
