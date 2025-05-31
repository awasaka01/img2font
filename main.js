// https://unicode.org/Public/UNIDATA/UnicodeData.txt
// import { readFileSync, writeFileSync } from "node:fs";
// import path, { parse } from "node:path";
// import http from "http";





// Config
const PORT = 5500;

const IMAGE_PROPERTIES = {
	"character_width": 8,
	"character_height": 16,
	"gap_around": 1,
	"characters_per_row": 10,
};

// Shorten variable names
const perRow = IMAGE_PROPERTIES.characters_per_row;


const BLOCKS = {
	"Basic Latin -m": [[0x0020, 0x007E]],
	// ↑ https://www.compart.com/en/unicode/block/U+0000
	"Latin-1 Supplement": [[0x0080, 0x00FF]],
	// ↑ https://www.compart.com/en/unicode/block/U+0080
	"General Punctuation -m": [[0x2010, 0x2027], [0x2030, 0x205E]],
	// ↑ https://www.compart.com/en/unicode/block/U+2000
	"Arrows": [[0x2190, 0x21FF]],
	// ↑ https://www.compart.com/en/unicode/block/U+2190
	"Mathematical Operators": [[0x2200, 0x22FF]],
	// ↑ https://www.compart.com/en/unicode/block/U+2200
	"Miscellaneous Technical": [[0x2300, 0x23FF]],
	// ↑ https://www.compart.com/en/unicode/block/U+2300
	"Box Drawing": [[0x2500, 0x257F]],
	// ↑ https://www.compart.com/en/unicode/block/U+2500
	"Block Elements": [[0x2580, 0x259F]],
	// ↑ https://www.compart.com/en/unicode/block/U+2580
	"Geometric Shapes": [[0x25A0, 0x25FF]],
	// ↑ https://www.compart.com/en/unicode/block/U+25A0
	"Miscellaneous Symbols": [[0x2600, 0x26FF]],
	// ↑ https://www.compart.com/en/unicode/block/U+2600
	"Supplemental Arrows A": [[0x27F0, 0x27FF]],
	// ↑ https://www.compart.com/en/unicode/block/U+27F0
	"Miscelennous Symbols and Arrows": [[0x2B00, 0x2BFF]],
	// ↑ https://www.compart.com/en/unicode/block/U+2B00
	"Specials": [[0xFFF0, 0XFFFF]],
	// ↑ https://www.compart.com/en/unicode/block/U+FFF0
	"Halfwidth and Fullwidth Forms": [[0xFF01, 0xFFEE]],
	// ↑ https://www.compart.com/en/unicode/block/U+FF00
	"Small Form Variants": [[0xFE50, 0xFE6F]],
	// ↑ https://www.compart.com/en/unicode/block/U+FE50
	"Chess Symbols -m": [[0x2654, 0x265F]],
	// ↑ https://www.compart.com/en/unicode/block/U+2654
	"Supplemental Arrows C": [[0x1F800, 0x1F8FF]],
	// ↑ https://www.compart.com/en/unicode/block/U+1F800
	"Geometric Shapes Extended": [[0x1F780, 0x1F7D8]],
	// ↑ https://www.compart.com/en/unicode/block/U+1F780
	"Alchemical Symbols": [[0x1F700, 0x1F77F]],
	// ↑ https://www.compart.com/en/unicode/block/U+1F700
};

document.addEventListener("DOMContentLoaded", async () => {
	const BLOCKS_DATA = await generateData();

	console.log(BLOCKS_DATA);
	generateTemplateImages();





});


// Generate the full data for each block
async function generateData () {
	const UNICODE_FULL_LIST = (await (await fetch("./unicode.txt")).text()).split("\n").map((x) => x.split(";").slice(0, 2));

	return Object.entries(BLOCKS).map(([name, ranges]) => {

		const block = {
			// Generated Here:
			name,
			characters: [],
			height: 0,
			// Extended Data:
			elements: {
				fg: undefined,
				bg: undefined,
				grid: undefined,
				infotext: undefined,
			},
		};

		// Generate characters
		ranges.forEach(([start, end]) => {
			for (let i = start; i <= end; i++) {
				const obj = generateCharacterObjectFromUTFCode(i.toString(16).toUpperCase().padStart(4, "0"), i);
				block.characters.push(obj);
			}
		});
		block.height = Math.ceil(block.characters.length / perRow);

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
				domElement: undefined,

				utfcode: utfcode,
				name: name,
				symbol: String.fromCharCode(utfcodeInDecimal),
			};

			// Calculate which row and column the character will be in the grid
			const characterAmount = block.characters.length;
			obj.row = characterAmount % perRow;
			obj.col = Math.floor(characterAmount / perRow);

			// Calculate the actual pixel position of the character in the image
			obj.topLeft.x = (obj.row * IMAGE_PROPERTIES.character_width) + (IMAGE_PROPERTIES.gap_around * obj.row) + 1;
			obj.topLeft.y = (obj.col * IMAGE_PROPERTIES.character_height) + (IMAGE_PROPERTIES.gap_around * obj.col) + 1;
			obj.bottomRight.x = obj.topLeft.x + IMAGE_PROPERTIES.character_width;
			obj.bottomRight.y = obj.topLeft.y + IMAGE_PROPERTIES.character_height;

			return obj;
		}
		return block;
	});
}

function generateExtendedData (params) {

}


function generateTemplateImages (params) {

}

function generateFontFromFiles (params) {

}

function updateTextDisplayForBlock (block, characterSelection) {

}
